
import { supabase } from '@/integrations/supabase/client';

// School Settings service specifically for the school/Settings.tsx page

export interface SchoolSetting {
  id?: string;
  key: string;
  value: any;
}

// Get settings for a school
export const getSchoolSettings = async (schoolId: string) => {
  try {
    const { data, error } = await supabase
      .from('sm_settings')
      .select('id, key, value')
      .eq('school_id', schoolId);

    if (error) {
      console.error('Error fetching school settings:', error);
      return [] as SchoolSetting[];
    }

    return (data || []) as SchoolSetting[];
  } catch (err) {
    console.error('Unexpected error fetching school settings:', err);
    return [] as SchoolSetting[];
  }
};

// Create or update a school setting
export const updateSchoolSetting = async (
  setting: SchoolSetting,
  schoolIdParam?: string
) => {
  try {
    const schoolId = schoolIdParam || localStorage.getItem('currentSchoolId');
    if (!schoolId) {
      throw new Error('No school selected.');
    }

    if (setting.id) {
      const { data, error } = await supabase
        .from('sm_settings')
        .update({ value: setting.value })
        .eq('id', setting.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data as SchoolSetting;
    }

    const { data, error } = await supabase
      .from('sm_settings')
      .upsert(
        {
          school_id: schoolId,
          key: setting.key,
          value: setting.value,
        },
        { onConflict: 'school_id,key' }
      )
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as SchoolSetting;
  } catch (err) {
    console.error('Error updating school setting:', err);
    throw err;
  }
};
