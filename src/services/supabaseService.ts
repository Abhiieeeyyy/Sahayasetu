/**
 * ============================================================================
 * SAHAYASETU SUPABASE DATA SERVICE LAYER
 * ============================================================================
 * 
 * Purpose:
 * Coordinates relational database operations matching Disaster_Relief_Platform_Overview.pptx
 * (Slide 6 Core Data Model), enforcing strict regional scoping for Regional Admins
 * and complete access for Super Admins.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Beneficiary, JobRequisition, DistrictTenant, RegionalAdminAccount } from '../types';

/**
 * Persists a newly registered beneficiary in Supabase `users` table
 * and records an immutable audit log entry.
 */
/**
 * Persists a newly registered beneficiary in Supabase `users` table
 * with ALL verification data collected during Google-authenticated registration,
 * and records an immutable audit log entry.
 */
export const persistBeneficiary = async (
  beneficiary: Beneficiary, 
  authUserId?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  // Validate if authUserId is a valid UUID format (avoids Postgres UUID syntax errors)
  const isUuid = (val?: string): boolean => {
    if (!val) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  };
  const validAuthId = isUuid(authUserId || beneficiary.authUserId) 
    ? (authUserId || beneficiary.authUserId) 
    : null;

  try {
    const { error: userError } = await supabase.from('users').upsert({
      id: beneficiary.id,
      auth_user_id: validAuthId,
      name: beneficiary.name,
      email: beneficiary.authEmail || null,
      phone: beneficiary.phone,
      aadhaar_masked: beneficiary.aadhaarMasked,
      ration_card_no: beneficiary.rationCardNumber || null,
      region_id: beneficiary.districtId,
      district_id: beneficiary.districtId,
      district_name: beneficiary.district || 'Wayanad',
      camp_name: beneficiary.campId,
      family_members_count: beneficiary.dependentsCount || 1,
      calamity: beneficiary.calamity,
      skills: beneficiary.skills,
      experience_years: beneficiary.experienceYears,
      living_status: beneficiary.livingStatus,
      daily_wage_tier: beneficiary.dailyWageTier,
      is_medical_fit: beneficiary.isMedicalFit,
      is_bio_verified: beneficiary.isBioVerified,
      placement_status: beneficiary.placementStatus,
      assigned_project_id: beneficiary.assignedProjectId || null,
      emergency_contact: beneficiary.emergencyContact || null,
      bank_account_dbt: {
        account: beneficiary.bankAccount || '',
        ifsc: beneficiary.bankIfsc || '',
        dbt_linked: Boolean(beneficiary.dbtLinked),
        state: beneficiary.state || 'Kerala',
        district: beneficiary.district || '',
        job_priorities: beneficiary.jobPriorities || [],
        relationship: beneficiary.relationshipToAccount || 'Self',
        avatar_url: beneficiary.authAvatarUrl || '',
        aadhaar_raw: beneficiary.aadhaarRaw || '',
        calamity_title: beneficiary.calamityTitle || beneficiary.calamity
      },
      updated_at: new Date().toISOString()
    });

    if (userError) {
      console.error('Supabase users upsert error:', userError);
      return { success: false, error: userError.message };
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase persist error:', err);
    return { success: false, error: String(err) };
  }
};

/**
 * Maps a raw Supabase Postgres row from the `users` table to the frontend Beneficiary model.
 */
const mapRowToBeneficiary = (row: any): Beneficiary => ({
  id: row.id,
  authUserId: row.auth_user_id || undefined,
  name: row.name,
  authEmail: row.email || undefined,
  phone: row.phone,
  aadhaarMasked: row.aadhaar_masked,
  districtId: row.district_id || row.region_id || 'KL-WYD-2024',
  campId: row.camp_name,
  calamity: row.calamity,
  calamityTitle: row.bank_account_dbt?.calamity_title || row.calamity,
  skills: row.skills || [],
  experienceYears: row.experience_years || 0,
  livingStatus: row.living_status || 'Relief Camp',
  dailyWageTier: Number(row.daily_wage_tier) || 850,
  isMedicalFit: Boolean(row.is_medical_fit),
  isBioVerified: Boolean(row.is_bio_verified),
  placementStatus: row.placement_status || 'Available',
  assignedProjectId: row.assigned_project_id || undefined,
  registeredDate: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Registered',
  rationCardNumber: row.ration_card_no || undefined,
  dependentsCount: row.family_members_count || 1,
  emergencyContact: row.emergency_contact || undefined,
  bankAccount: row.bank_account_dbt?.account || undefined,
  bankIfsc: row.bank_account_dbt?.ifsc || undefined,
  dbtLinked: row.bank_account_dbt?.dbt_linked,
  state: row.bank_account_dbt?.state || 'Kerala',
  district: row.bank_account_dbt?.district || undefined,
  jobPriorities: row.bank_account_dbt?.job_priorities || [],
  relationshipToAccount: row.bank_account_dbt?.relationship || 'Self',
  authAvatarUrl: row.bank_account_dbt?.avatar_url || undefined,
  aadhaarRaw: row.bank_account_dbt?.aadhaar_raw || undefined
});

/**
 * Fetches registered beneficiaries strictly scoped to a single region.
 * Used by Regional Admin (enforced at service level AND database RLS level).
 */
export const fetchRegionalBeneficiaries = async (
  regionId: string = 'KL-WYD-2024'
): Promise<Beneficiary[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`district_id.eq.${regionId},region_id.eq.${regionId}`);

    if (error) {
      console.warn('Supabase regional fetch warning:', error.message);
      return [];
    }

    return (data || []).map(mapRowToBeneficiary);
  } catch (err) {
    console.warn('Supabase regional fetch error:', err);
    return [];
  }
};

/**
 * Fetches all registered beneficiaries across all regions (Super Admin only).
 */
export const fetchAllBeneficiaries = async (): Promise<Beneficiary[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.warn('Supabase fetch all warning:', error.message);
      return [];
    }

    return (data || []).map(mapRowToBeneficiary);
  } catch (err) {
    console.warn('Supabase fetch all error:', err);
    return [];
  }
};

/**
 * Deletes a registered beneficiary from Supabase `users`.
 */
export const deleteBeneficiaryFromDb = async (
  beneficiaryId: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', beneficiaryId);

    if (error) {
      console.warn('Supabase delete error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase delete exception:', err);
    return { success: false, error: String(err) };
  }
};

/**
 * Subscribes to live Postgres database changes on the `users` table via Supabase Realtime.
 * Automatically notifies callbacks on INSERT, UPDATE, and DELETE.
 */
export const subscribeToUsersRealtime = (
  onChange: (eventType: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) => void
): (() => void) => {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('sahayasetu_users_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users' },
      (payload) => {
        onChange(payload.eventType as any, payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribes to live Postgres database changes across all 4 managed database entities:
 * 1. users
 * 2. regional_admins
 * 3. job_posts
 * 4. disaster_details
 */
export const subscribeToAllEntitiesRealtime = (
  onDataChanged: (table: string, eventType: string, payload: any) => void
): (() => void) => {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('sahayasetu_all_entities_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
      onDataChanged('users', payload.eventType, payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'regional_admins' }, (payload) => {
      onDataChanged('regional_admins', payload.eventType, payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'job_posts' }, (payload) => {
      onDataChanged('job_posts', payload.eventType, payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'disaster_details' }, (payload) => {
      onDataChanged('disaster_details', payload.eventType, payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Persists a newly provisioned regional admin account into `regional_admins` table.
 */
export const persistRegionalAdmin = async (
  admin: RegionalAdminAccount
): Promise<void> => {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.from('regional_admins').upsert({
      id: admin.id,
      officer_credential_id: admin.officerCredentialId || admin.sdmaOfficerId,
      password: admin.password || admin.accessKey || 'Pass@2026',
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '+91 94470 00000',
      district_id: admin.districtId,
      district_name: admin.districtName,
      ngo_name: admin.ngoName || 'Accredited Relief NGO',
      ngo_darpan_id: admin.ngoDarpanId || null,
      sdma_officer_id: admin.officerCredentialId || admin.sdmaOfficerId,
      role: 'regional-admin',
      status: admin.status
    });
  } catch (err) {
    console.warn('Supabase admin persist error:', err);
  }
};

/**
 * Fetches all regional admin accounts from the Supabase `regional_admins` table.
 */
export const fetchRegionalAdminsFromDb = async (): Promise<RegionalAdminAccount[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('regional_admins')
      .select('*')
      .order('district_name', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      ngoName: row.ngo_name,
      ngoDarpanId: row.ngo_darpan_id,
      accessKey: row.password,
      password: row.password,
      sdmaOfficerId: row.sdma_officer_id || row.officer_credential_id,
      officerCredentialId: row.officer_credential_id,
      districtId: row.district_id,
      districtName: row.district_name,
      dateProvisioned: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : 'Active',
      status: row.status
    }));
  } catch (err) {
    console.warn('Supabase fetch regional admins error:', err);
    return [];
  }
};

/**
 * Fetches all job posts from the Supabase `job_posts` (or `job_listings`) table.
 */
export const fetchJobPostsFromDb = async (): Promise<JobRequisition[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map(row => ({
      id: row.id,
      title: row.title,
      agency: row.agency,
      sectorLocation: row.sector_location || row.district_name,
      priority: row.priority || 'SOS Urgent',
      requiredSkills: row.required_skills || ['General Civil Labor'],
      requiredCount: row.required_count || 1,
      assignedCount: row.assigned_count || 0,
      dailyWage: Number(row.daily_wage) || 850,
      hardshipAllowance: Number(row.hardship_allowance) || 150,
      durationWeeks: row.duration_weeks || 4,
      startDate: row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : 'Immediate',
      status: row.status || 'Open',
      districtId: row.district_id,
      districtName: row.district_name
    }));
  } catch (err) {
    console.warn('Supabase fetch job posts error:', err);
    return [];
  }
};

/**
 * Persists a new or updated job post into `job_posts`.
 */
export const persistJobPost = async (job: JobRequisition): Promise<void> => {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.from('job_posts').upsert({
      id: job.id,
      title: job.title,
      agency: job.agency,
      district_id: job.districtId || 'KL-WYD-2024',
      district_name: job.districtName || 'Wayanad',
      sector_location: job.sectorLocation,
      priority: job.priority,
      required_skills: job.requiredSkills,
      required_count: job.requiredCount,
      assigned_count: job.assignedCount,
      daily_wage: job.dailyWage,
      hardship_allowance: job.hardshipAllowance,
      duration_weeks: job.durationWeeks,
      status: job.status
    });
  } catch (err) {
    console.warn('Supabase job persist error:', err);
  }
};

/**
 * Fetches all disaster records from the Supabase `disaster_details` table.
 */
export const fetchDisasterDetailsFromDb = async (): Promise<DistrictTenant[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('disaster_details')
      .select('*')
      .order('district_name', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map(row => ({
      districtCode: row.district_id,
      districtName: `${row.district_name} (${row.disaster_title})`,
      stateName: 'Kerala',
      calamitySeverity: row.severity || 'High Tier-2',
      activeIntake: row.displaced_persons_count || 0,
      placedWorkers: 0,
      openRequisitions: 0,
      skillShortageIndex: 0,
      rlsEnforced: true,
      postGisShard: `shard_${row.district_id.toLowerCase().replace(/-/g, '_')}`,
      latencyMs: 18,
      partnerNgosCount: row.active_relief_camps || 1
    }));
  } catch (err) {
    console.warn('Supabase fetch disasters error:', err);
    return [];
  }
};

/**
 * Persists a candidate work assignment.
 */
export const persistJobApproval = async (
  listingId: string,
  beneficiaryId: string
): Promise<void> => {
  if (!isSupabaseConfigured) return;

  try {
    // Update assignedCount on job_posts table
    const { data: currentJob } = await supabase
      .from('job_posts')
      .select('assigned_count, required_count')
      .eq('id', listingId)
      .single();

    if (currentJob) {
      const nextCount = (currentJob.assigned_count || 0) + 1;
      await supabase
        .from('job_posts')
        .update({
          assigned_count: nextCount,
          status: nextCount >= currentJob.required_count ? 'Completed' : 'Fulfilling'
        })
        .eq('id', listingId);
    }
  } catch (err) {
    console.warn('Supabase job approval update notice:', err);
  }
};

/**
 * Purges all registered beneficiaries from Supabase database `users` table.
 */
export const purgeAllUsersFromDb = async (): Promise<void> => {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('users').delete().neq('id', '__dummy_keep_table__');
  } catch (err) {
    console.warn('Supabase database user purge error:', err);
  }
};
