/**
 * ============================================================================
 * SAHAYASETU DISASTER REHABILITATION PLATFORM - TYPE DEFINITIONS
 * ============================================================================
 * 
 * This file defines the core domain models, enums, and component prop types
 * used across the entire SahayaSetu frontend application.
 * 
 * Strict TypeScript typing ensures structural consistency across:
 * 1. Beneficiary Profile Intake (BPI)
 * 2. Job Requisitions & Skill-Matching Engine (JME)
 * 3. Super Admin Multi-Tenancy & Global Analytics (SGA)
 * 4. Beneficiary Self-Portal & Wage Verification
 * 5. Dynamic User Onboarding & Persona Switching
 */

// ----------------------------------------------------------------------------
// 1. NAVIGATION & PERSPECTIVE TYPES
// ----------------------------------------------------------------------------

/**
 * Represents the major functional view tabs available in the application.
 * Used by Header, Sidebar, and App routing state.
 */
export type NavigationTab = 
  | 'beneficiary-intake'     // BPI: Field intake and live roster
  | 'skill-matching'         // JME: Civil reconstruction dispatch & match engine
  | 'super-admin'            // SGA: Statewide multi-tenant command center
  | 'self-portal'            // Beneficiary wage and active assignment portal
  | 'registration'           // Rapid onboarding dossier (Citizen / Officer)
  | 'citizen-dashboard';     // Logged-in citizen view & readiness status

/**
 * Represents the active user role/perspective to enforce strict role-based access control (RBAC):
 * 1. 'regional-admin': Restricted to viewing registered user details and dispatching ONLY within their assigned region (KL-WYD-2024).
 * 2. 'super-admin': Full statewide cross-regional oversight, global tenant analytics, all regions access.
 * 3. 'citizen-user': Restricted exclusively to registering with necessary details and tracking their application status.
 */
export type UserRole = 
  | 'regional-admin'         // Regional Admin: Scoped strictly to single region (KL-WYD-2024)
  | 'super-admin'            // Super Admin: All access across all regions & statewide command
  | 'citizen-user';          // Citizen: Register with necessary details & track application

/**
 * Supported local languages for citizen registration (English and Malayalam only).
 */
export type RegistrationLanguage = 'EN' | 'ML';

/**
 * Regional administrator credentials provisioned strictly by Super Admin for each Kerala district.
 */
export interface RegionalAdminAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ngoName?: string;
  ngoDarpanId?: string;
  accessKey?: string;
  password?: string;
  sdmaOfficerId: string;
  officerCredentialId?: string;
  districtId: string;
  districtName: string;
  dateProvisioned: string;
  status: 'Active' | 'Suspended';
}

/**
 * Declared disaster record in a specific administrative region.
 */
export interface RegionDisaster {
  id: string;
  regionId: string;                    // e.g., 'KL-WYD-2024'
  regionName: string;                  // e.g., 'Wayanad Hills (Meppadi / Chooralmala)'
  title: string;                       // e.g., 'Chooralmala & Mundakkai Massive Landslide'
  disasterType: 'Landslide' | 'Flood' | 'Cyclone' | 'Earthquake' | 'Flash Flood' | 'Cloudburst' | 'Coastal Surge';
  severity: 'Extreme Tier-1' | 'High Tier-2' | 'Moderate Tier-3';
  declaredDate: string;                // e.g., '2024-07-30'
  affectedTaluks: string;              // e.g., 'Vythiri, Meppadi, Mundakkai'
  estimatedAffected: number;           // Headcount affected
  reliefCampsCount: number;            // Active relief shelter camps
  status: 'Active Emergency' | 'Relief & Rescue' | 'Rehabilitation' | 'Recovery Phase' | 'Monitoring' | 'Resolved';
  emergencyDirectives?: string;        // Response orders or NDRF deployment notes
}

/**
 * Application status tracking lifecycle for displaced citizens.
 */
export type ApplicationStepStatus = 'completed' | 'current' | 'pending';

export interface ApplicationTrackingStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: ApplicationStepStatus;
}

// ----------------------------------------------------------------------------
// 2. BENEFICIARY PROFILE & ROSTER TYPES (BPI)
// ----------------------------------------------------------------------------

/**
 * Disaster calamity classifications to prioritize relief and determine vulnerability.
 */
export type CalamityType = 'Landslide' | 'Flood' | 'Cyclone' | 'Earthquake';

/**
 * Living and shelter accommodation status of displaced individuals.
 */
export type LivingStatus = 'Relief Camp' | 'Makeshift' | 'Host Family' | 'Permanent Repaired';

/**
 * Vocational skill specializations verified by field coordinators.
 */
export type VocationalSkill = 
  | 'Masonry' 
  | 'Carpentry' 
  | 'Electrical' 
  | 'Plumbing' 
  | 'Heavy Machinery' 
  | 'General Civil Labor' 
  | 'Steel Fixing' 
  | 'Roofing';

/**
 * Represents a registered beneficiary record in the field relief roster.
 */
export interface Beneficiary {
  id: string;                    // Unique identifier (e.g., 'BEN-9402')
  name: string;                  // Full legal name
  phone: string;                 // Contact phone number (masked or unmasked)
  aadhaarMasked: string;         // Masked Aadhaar token (e.g., '•••• •••• 8821')
  districtId: string;            // Regional jurisdiction ID (e.g., 'KL-WYD-2024')
  campId: string;                // Specific relief camp or shelter sector
  calamity: CalamityType | string; // Type or declared disaster title impacting this person
  calamityTitle?: string;        // Specific declared disaster title uploaded by Super Admin
  skills: VocationalSkill[];     // Verified vocational skills
  experienceYears: number;       // Years of craft or vocational experience
  livingStatus: LivingStatus;    // Current living condition
  dailyWageTier: number;         // Established standard daily wage (INR)
  isMedicalFit: boolean;         // Medical fitness certification for heavy labor
  isBioVerified: boolean;        // Aadhaar biometric validation flag
  placementStatus: 'Available' | 'Assigned' | 'Resting' | 'In-Review'; // Current deployment state
  assignedProjectId?: string;    // ID of active reconstruction assignment if any
  registeredDate: string;        // Timestamp of field intake
  // Verification Data Fields (collected from user after Google Sign-In)
  state?: 'Kerala';              // State (Exclusively Kerala)
  district?: string;             // District within the state
  jobPriorities?: string[];      // Ranked job preferences (Priority 1, 2, 3)
  relationshipToAccount?: string;// Relationship of applicant to account holder (Self, Spouse, Parent, Child, Dependent)
  aadhaarRaw?: string;           // 12-digit Aadhaar number
  rationCardNumber?: string;     // Ration card number or relief kit token
  dependentsCount?: number;      // Number of dependent family members in shelter
  emergencyContact?: string;     // Emergency contact person name & phone
  bankAccount?: string;          // Direct Benefit Transfer (DBT) bank account
  bankIfsc?: string;             // Bank IFSC branch code
  dbtLinked?: boolean;           // Authorization flag for automatic DBT wage transfer
  authUserId?: string;           // Supabase auth user UUID
  authEmail?: string;            // Authenticated Google account email
  authAvatarUrl?: string;        // Google profile photo URL
  assignedWorksite?: string;     // Specific worksite location/address of assigned project
  worksite?: string;             // Worksite location or address
}

// ----------------------------------------------------------------------------
// 3. JOB REQUISITIONS & SKILL-MATCHING ENGINE TYPES (JME)
// ----------------------------------------------------------------------------

/**
 * Priority tier for emergency civil reconstruction projects.
 */
export type ProjectPriority = 'SOS Urgent' | 'High Priority' | 'Medium Standard';

/**
 * Represents an emergency civil rehabilitation requisition posted by NGOs/Agencies.
 */
export interface JobRequisition {
  id: string;                    // Unique job requisition code (e.g., 'REQ-WYD-104')
  title: string;                 // Project title (e.g., 'Chooralmala Retaining Wall Reinforcement')
  agency: string;                // Contracting agency or government department (e.g., 'KSDMA / Habitat')
  sectorLocation: string;        // Specific geographic sector (e.g., 'Chooralmala Sector 2')
  priority: ProjectPriority;     // Urgency level
  requiredSkills: VocationalSkill[]; // Skills mandated for this project
  requiredCount: number;         // Total laborers/artisans requested
  assignedCount: number;         // Number of candidates already dispatched
  dailyWage: number;             // Daily wage rate offered (INR)
  hardshipAllowance: number;     // Additional hardship/hazard zone allowance (INR)
  durationWeeks: number;         // Estimated project duration in weeks
  startDate: string;             // Planned commencement date
  status: 'Open' | 'Fulfilling' | 'Completed'; // Requisition status
  districtId?: string;           // District jurisdiction code (e.g. 'KL-WYD-2024')
  districtName?: string;         // Human-readable district title
  worksite?: string;             // Specific worksite location / address
  postedByAdminId?: string;      // ID of the regional admin who created this job
  postedByAdminName?: string;    // Name of the regional admin
}

/**
 * Output of the matching algorithm evaluating candidate overlap for a job.
 */
export interface CandidateMatch {
  beneficiary: Beneficiary;      // The candidate profile
  overlapScore: number;          // Match percentage (e.g., 96%)
  distanceKm: number;            // Proximity distance from shelter camp to worksite
  skillBreakdown: {              // Granular score components
    primarySkillMatch: boolean;
    experienceScore: number;
    medicalFitness: boolean;
    proximityScore: number;
  };
}

// ----------------------------------------------------------------------------
// 4. SUPER ADMIN MULTI-TENANCY & REGIONAL GOVERNANCE TYPES (SGA)
// ----------------------------------------------------------------------------

/**
 * Telemetry and governance metrics for a regional jurisdiction / district tenant.
 */
export interface DistrictTenant {
  districtCode: string;          // District code (e.g., 'KL-WYD-2024')
  districtName: string;          // Human-readable district title
  stateName: string;             // State jurisdiction
  calamitySeverity: 'Extreme Tier-1' | 'High Tier-2' | 'Moderate Tier-3'; // Hazard level
  activeIntake: number;          // Total displaced beneficiaries registered
  placedWorkers: number;         // Placed workers count
  openRequisitions: number;       // Open requisitions count
  skillShortageIndex: number;    // Deficit index (0-100 scale, higher is worse)
  rlsEnforced: boolean;          // Strict Row-Level Security isolation flag
  postGisShard: string;          // Technical DB shard label
  latencyMs: number;             // VSAT sync relay latency
  partnerNgosCount: number;      // Accredited relief NGOs operating in region
}

// ----------------------------------------------------------------------------
// 5. BENEFICIARY SELF-PORTAL & WAGE LEDGER TYPES
// ----------------------------------------------------------------------------

/**
 * A daily wage entry recorded for an assigned worker during reconstruction.
 */
export interface WageEntry {
  date: string;                  // Date of work (e.g., '08 Sep 2026')
  projectName: string;           // Project name
  hoursWorked: number;           // Hours clocked
  baseWage: number;              // Standard daily base wage (INR)
  hardshipAddon: number;         // Hazard / hardship area supplement (INR)
  totalAmount: number;           // Combined payout (INR)
  status: 'Disbursed' | 'Processing' | 'In Audit'; // Direct Benefit Transfer (DBT) status
  transactionRef?: string;       // Public Financial Management System (PFMS) ref
}

/**
 * Emergency notification or broadcast bulletin published to beneficiaries.
 */
export interface EmergencyBroadcast {
  id: string;                    // Unique broadcast ID
  title: string;                 // Broadcast title
  timestamp: string;             // Time posted
  urgency: 'Critical' | 'Warning' | 'Notice'; // Urgency classification
  content: string;               // Announcement body
  actionLabel?: string;          // Interactive CTA label if any
  contactPhone?: string;         // Emergency helpline
}

// ----------------------------------------------------------------------------
// 6. UI INTERACTION & FEEDBACK TOAST TYPES
// ----------------------------------------------------------------------------

/**
 * Flash feedback toast notification triggered during interactive operations
 * (e.g., dispatching candidates, registering records, toggling offline mode).
 */
export interface ToastNotification {
  id: string;                    // Unique toast identifier
  type: 'success' | 'warning' | 'info' | 'error'; // Visual variant
  title: string;                 // Header text
  message: string;               // Body explanation
  smsCode?: string;              // Simulated mobile SMS dispatch reference
}
