export interface MagicByteValidationResult {
  valid: boolean;
  detectedType: string;
  error?: string;
}

export async function validateFileMagicBytes(
  file: File
): Promise<MagicByteValidationResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0, 8));
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  // 1. Detect Dangerous Executable Signatures
  // MZ header for Windows PE / EXE / DLL
  if (bytes[0] === 0x4d && bytes[1] === 0x5a) {
    return {
      valid: false,
      detectedType: "EXE",
      error: "Security rejection: Windows executable signature detected.",
    };
  }
  // ELF header for Linux executable (0x7F 'E' 'L' 'F')
  if (
    bytes[0] === 0x7f &&
    bytes[1] === 0x45 &&
    bytes[2] === 0x4c &&
    bytes[3] === 0x46
  ) {
    return {
      valid: false,
      detectedType: "ELF",
      error: "Security rejection: Linux binary signature detected.",
    };
  }

  // 2. Validate PDF Signature (%PDF-)
  const isPdf =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d;

  // 3. Validate ZIP Signature (PK\x03\x04 - DOCX, PPTX)
  const isZip =
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04;

  // 4. Validate OLE2 Compound File Binary Signature (Legacy DOC, PPT)
  const isOle2 =
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0;

  if (ext === ".pdf") {
    if (!isPdf) {
      return {
        valid: false,
        detectedType: "Unknown",
        error: `File "${file.name}" has .pdf extension but does not contain a valid PDF signature.`,
      };
    }
    return { valid: true, detectedType: "application/pdf" };
  }

  if (ext === ".docx") {
    if (!isZip) {
      return {
        valid: false,
        detectedType: "Unknown",
        error: `File "${file.name}" has .docx extension but does not contain a valid DOCX container.`,
      };
    }
    return {
      valid: true,
      detectedType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }

  if (ext === ".pptx") {
    if (!isZip) {
      return {
        valid: false,
        detectedType: "Unknown",
        error: `File "${file.name}" has .pptx extension but does not contain a valid PPTX container.`,
      };
    }
    return {
      valid: true,
      detectedType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
  }

  if (ext === ".doc") {
    if (!isOle2 && !isZip) {
      return {
        valid: false,
        detectedType: "Unknown",
        error: `File "${file.name}" does not match Microsoft Word binary structure.`,
      };
    }
    return { valid: true, detectedType: "application/msword" };
  }

  if (ext === ".ppt") {
    if (!isOle2 && !isZip) {
      return {
        valid: false,
        detectedType: "Unknown",
        error: `File "${file.name}" does not match Microsoft PowerPoint binary structure.`,
      };
    }
    return { valid: true, detectedType: "application/vnd.ms-powerpoint" };
  }

  return {
    valid: false,
    detectedType: "Unsupported",
    error: `Unsupported file extension "${ext}". Allowed formats are PDF, DOC, DOCX, PPT, PPTX.`,
  };
}

