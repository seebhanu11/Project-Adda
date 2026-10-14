export interface MockEnquiry {
  id: string;
  reference_no: string;
  student_name: string;
  college_name: string;
  course_branch_year: string;
  whatsapp_number: string;
  service_type: string;
  project_topic: string;
  requirement_description: string;
  deadline: string;
  status: "New" | "Under Review" | "Quoted" | "Approved" | "Rejected";
  created_at: string;
  files: {
    id: string;
    file_name: string;
    file_size_bytes: number;
    mime_type: string;
    storage_path: string;
  }[];
}

export interface MockQuotation {
  id: string;
  enquiry_id: string;
  reference_no: string; // e.g. QT-2026-081
  student_name: string;
  whatsapp_number: string;
  project_topic: string;
  service_type: string;
  quote_amount: number;
  advance_amount: number;
  remaining_balance: number;
  scope_summary: string;
  validity_days: number;
  status: "Draft" | "Sent" | "Accepted" | "Declined";
  notes?: string;
  created_at: string;
}

export interface MockPayment {
  id: string;
  order_id: string;
  payment_milestone: "Advance" | "Final";
  amount: number;
  payment_method: string;
  upi_transaction_id: string;
  is_confirmed: boolean;
  confirmed_by: string;
  confirmed_at: string;
  notes?: string;
  created_at: string;
}

export interface MockOrder {
  id: string;
  order_number: string; // e.g. ORD-2026-1041
  enquiry_id: string;
  enquiry_ref: string;
  quotation_id: string;
  student_name: string;
  college_name: string;
  whatsapp_number: string;
  service_type: string;
  project_topic: string;
  total_amount: number;
  advance_paid: number;
  final_paid: number;
  balance_due: number;
  status:
    | "Awaiting Advance"
    | "In Progress"
    | "Awaiting Final Payment"
    | "Completed"
    | "Cancelled";
  target_delivery_date: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  payments: MockPayment[];
}

export const MOCK_ENQUIRIES: MockEnquiry[] = [
  {
    id: "enq-001",
    reference_no: "PA-2026-1084",
    student_name: "Rahul Sharma",
    college_name: "BMS College of Engineering, Bengaluru",
    course_branch_year: "B.Tech CSE, 4th Year (8th Sem)",
    whatsapp_number: "+919876543210",
    service_type: "Project Documentation Editing & Formatting",
    project_topic: "Real-Time Object Detection Using YOLOv8 for Autonomous UAV Navigation",
    requirement_description:
      "We have completed the code and simulation results. We have a 52-page rough Word document with 14 system architecture figures and 6 mathematical equations. Need it strictly formatted according to IEEE thesis guidelines with roman numeral preliminaries, auto-updating table of contents, and BibTeX citations. Guide review is on Friday.",
    deadline: "2026-10-18",
    status: "New",
    created_at: "2026-10-14T09:30:00Z",
    files: [
      {
        id: "f-01",
        file_name: "uav_project_draft_v2.docx",
        file_size_bytes: 4820000,
        mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        storage_path: "PA-2026-1084/uav_project_draft_v2.docx",
      },
      {
        id: "f-02",
        file_name: "college_thesis_guidelines.pdf",
        file_size_bytes: 1240000,
        mime_type: "application/pdf",
        storage_path: "PA-2026-1084/college_thesis_guidelines.pdf",
      },
    ],
  },
  {
    id: "enq-002",
    reference_no: "PA-2026-1085",
    student_name: "Pooja Hegde",
    college_name: "RV College of Engineering",
    course_branch_year: "M.Tech VLSI Design, 2nd Year",
    whatsapp_number: "+919845012345",
    service_type: "Seminar Presentation Design & Editing",
    project_topic: "Low-Power Approximate Multiplier Architectures for Edge AI Inference",
    requirement_description:
      "Need a 24-slide high-impact seminar deck for my final departmental defense. I have rough bullet points and Cadence waveform screenshots. Slides need clean typography, timing cues, and a visual comparison table of power vs accuracy metrics.",
    deadline: "2026-10-16",
    status: "Under Review",
    created_at: "2026-10-13T14:15:00Z",
    files: [
      {
        id: "f-03",
        file_name: "vlsi_presentation_rough.pptx",
        file_size_bytes: 8900000,
        mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        storage_path: "PA-2026-1085/vlsi_presentation_rough.pptx",
      },
    ],
  },
  {
    id: "enq-003",
    reference_no: "PA-2026-1086",
    student_name: "Kiran Kumar",
    college_name: "PES University, Bengaluru",
    course_branch_year: "BCA, 3rd Year (6th Sem)",
    whatsapp_number: "+919123456789",
    service_type: "Internship Report Formatting",
    project_topic: "Full-Stack Cloud Microservices Architecture at FinTech Startup",
    requirement_description:
      "Completed 12-week summer internship. Need corporate internship report compiled with weekly log sheet tables, company certificate alignment, and technology overview according to university format.",
    deadline: "2026-10-25",
    status: "Quoted",
    created_at: "2026-10-12T11:00:00Z",
    files: [
      {
        id: "f-04",
        file_name: "internship_weekly_logs.docx",
        file_size_bytes: 2100000,
        mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        storage_path: "PA-2026-1086/internship_weekly_logs.docx",
      },
    ],
  },
  {
    id: "enq-004",
    reference_no: "PA-2026-1087",
    student_name: "Ananya Iyer",
    college_name: "Dayananda Sagar College of Engineering",
    course_branch_year: "B.Tech AI & Data Science, 4th Year",
    whatsapp_number: "+919765432109",
    service_type: "Academic Project Guidance",
    project_topic: "Federated Learning for Privacy-Preserving Healthcare Diagnostics",
    requirement_description:
      "Stuck on Chapter 3 (Methodology & System Architecture). Need mentorship on how to structure the data pipeline, differential privacy constraints, and viva defense talking points for external examiners.",
    deadline: "2026-10-22",
    status: "Approved",
    created_at: "2026-10-11T16:40:00Z",
    files: [
      {
        id: "f-05",
        file_name: "methodology_draft_ch3.pdf",
        file_size_bytes: 3400000,
        mime_type: "application/pdf",
        storage_path: "PA-2026-1087/methodology_draft_ch3.pdf",
      },
    ],
  },
];

export const MOCK_QUOTATIONS: MockQuotation[] = [
  {
    id: "qt-001",
    enquiry_id: "enq-003",
    reference_no: "QT-2026-081",
    student_name: "Kiran Kumar",
    whatsapp_number: "+919123456789",
    project_topic: "Full-Stack Cloud Microservices Architecture at FinTech Startup",
    service_type: "Internship Report Formatting",
    quote_amount: 2400,
    advance_amount: 1200,
    remaining_balance: 1200,
    scope_summary:
      "Full compilation of 12-week internship report: typography alignment, corporate certificate placement, logsheet tables styling, and university cover formatting.",
    validity_days: 7,
    status: "Sent",
    notes: "Student notified on WhatsApp. Awaiting approval and advance transfer.",
    created_at: "2026-10-12T13:45:00Z",
  },
  {
    id: "qt-002",
    enquiry_id: "enq-004",
    reference_no: "QT-2026-082",
    student_name: "Ananya Iyer",
    whatsapp_number: "+919765432109",
    project_topic: "Federated Learning for Privacy-Preserving Healthcare Diagnostics",
    service_type: "Academic Project Guidance",
    quote_amount: 4500,
    advance_amount: 2250,
    remaining_balance: 2250,
    scope_summary:
      "Chapter 3 architectural breakdown, differential privacy math formulations review, data pipeline block diagrams, and viva defense Q&A deck preparation.",
    validity_days: 7,
    status: "Accepted",
    notes: "Student approved quote on WhatsApp and transferred advance via UPI.",
    created_at: "2026-10-11T18:00:00Z",
  },
];

export const MOCK_PAYMENTS: MockPayment[] = [
  {
    id: "pay-001",
    order_id: "ord-001",
    payment_milestone: "Advance",
    amount: 2250,
    payment_method: "UPI",
    upi_transaction_id: "UPI/428910283741",
    is_confirmed: true,
    confirmed_by: "admin@projectadda.com",
    confirmed_at: "2026-10-12T09:15:00Z",
    notes: "Verified against HDFC current account statement.",
    created_at: "2026-10-12T09:10:00Z",
  },
  {
    id: "pay-002",
    order_id: "ord-003",
    payment_milestone: "Advance",
    amount: 2500,
    payment_method: "UPI",
    upi_transaction_id: "UPI/428109384729",
    is_confirmed: true,
    confirmed_by: "admin@projectadda.com",
    confirmed_at: "2026-10-05T11:00:00Z",
    notes: "Advance 50% verified.",
    created_at: "2026-10-05T10:45:00Z",
  },
  {
    id: "pay-003",
    order_id: "ord-003",
    payment_milestone: "Final",
    amount: 2500,
    payment_method: "UPI",
    upi_transaction_id: "UPI/428519483019",
    is_confirmed: true,
    confirmed_by: "admin@projectadda.com",
    confirmed_at: "2026-10-09T16:20:00Z",
    notes: "Final 50% settled. All deliverables released.",
    created_at: "2026-10-09T16:15:00Z",
  },
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ord-001",
    order_number: "ORD-2026-1041",
    enquiry_id: "enq-004",
    enquiry_ref: "PA-2026-1087",
    quotation_id: "qt-002",
    student_name: "Ananya Iyer",
    college_name: "Dayananda Sagar College of Engineering",
    whatsapp_number: "+919765432109",
    service_type: "Academic Project Guidance",
    project_topic: "Federated Learning for Privacy-Preserving Healthcare Diagnostics",
    total_amount: 4500,
    advance_paid: 2250,
    final_paid: 0,
    balance_due: 2250,
    status: "In Progress",
    target_delivery_date: "2026-10-21",
    created_at: "2026-10-12T09:20:00Z",
    updated_at: "2026-10-12T09:20:00Z",
    payments: [MOCK_PAYMENTS[0]],
  },
  {
    id: "ord-002",
    order_number: "ORD-2026-1042",
    enquiry_id: "enq-002",
    enquiry_ref: "PA-2026-1085",
    quotation_id: "qt-new",
    student_name: "Pooja Hegde",
    college_name: "RV College of Engineering",
    whatsapp_number: "+919845012345",
    service_type: "Seminar Presentation Design & Editing",
    project_topic: "Low-Power Approximate Multiplier Architectures for Edge AI Inference",
    total_amount: 3200,
    advance_paid: 0,
    final_paid: 0,
    balance_due: 3200,
    status: "Awaiting Advance",
    target_delivery_date: "2026-10-16",
    created_at: "2026-10-13T16:00:00Z",
    updated_at: "2026-10-13T16:00:00Z",
    payments: [],
  },
  {
    id: "ord-003",
    order_number: "ORD-2026-1040",
    enquiry_id: "enq-sample",
    enquiry_ref: "PA-2026-1080",
    quotation_id: "qt-sample",
    student_name: "Vikram Adiga",
    college_name: "BMS College of Engineering",
    whatsapp_number: "+919888877776",
    service_type: "Project Documentation Editing & Formatting",
    project_topic: "Smart Grid Power Quality Monitoring Using IoT & LoRaWAN",
    total_amount: 5000,
    advance_paid: 2500,
    final_paid: 2500,
    balance_due: 0,
    status: "Completed",
    target_delivery_date: "2026-10-09",
    delivered_at: "2026-10-09T17:00:00Z",
    created_at: "2026-10-05T10:30:00Z",
    updated_at: "2026-10-09T17:00:00Z",
    payments: [MOCK_PAYMENTS[1], MOCK_PAYMENTS[2]],
  },
];
