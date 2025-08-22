import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Save, Upload, Palette, Mail, Globe, Star, StarOff } from 'lucide-react';
import { getSchools } from '@/services/schoolManagementService';
import { getSchoolSettings, updateSchoolSetting } from '@/services/schoolSettingsService';
import { uploadFile, getFileUrl, setDefaultSchool, getDefaultSchoolId, isDefaultSchool, removeDefaultSchool } from '@/utils/storageUtils';
import { toast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/contexts/CurrentSchoolContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    schoolId: '',
    schoolName: 'Greenwood Academy',
    email: 'admin@greenwood.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Education Lane, Learning City, LC 12345',
    website: 'www.greenwood.edu',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    logo: null as File | null,
    logoUrl: '' as string,
  });
  const [defaultSchoolId, setDefaultSchoolId] = useState<string | null>(null);
  const { setCurrentSchoolId } = useCurrentSchool();

  // Fetch schools for the lookup
  const { data: schoolsData, isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const result = await getSchools({ page: 1, pageSize: 100 });
      return result.data;
    },
  });

  // Initialize schoolId from localStorage and load default school
  useEffect(() => {
    const sid = localStorage.getItem('currentSchoolId');
    const defaultId = getDefaultSchoolId();
    
    if (sid && !settings.schoolId) {
      setSettings(prev => ({ ...prev, schoolId: sid }));
    }
    
    if (defaultId) {
      setDefaultSchoolId(defaultId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved settings for selected school
  useEffect(() => {
    const load = async () => {
      if (!settings.schoolId) return;
      try {
        const data = await getSchoolSettings(settings.schoolId);
        const map: Record<string, any> = {};
        for (const item of data) map[item.key] = item.value;
        setSettings(prev => ({
          ...prev,
          email: map.contact_info?.email ?? prev.email,
          phone: map.contact_info?.phone ?? prev.phone,
          address: map.contact_info?.address ?? prev.address,
          website: typeof map.website === 'string' ? map.website : (map.website?.url ?? prev.website),
          primaryColor: map.colors?.primary ?? prev.primaryColor,
          secondaryColor: map.colors?.secondary ?? prev.secondaryColor,
          logoUrl: map.logo?.url ?? prev.logoUrl,
        }));
      } catch (e) {
        console.error('Failed to load school settings:', e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.schoolId]);
  const handleSettingChange = (key: string, value: string | File | null) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: value
      };
      
      // If school selection changes, update school name
      if (key === 'schoolId' && schoolsData) {
        const selectedSchool = schoolsData.find(school => school.id === value);
        if (selectedSchool) {
          newSettings.schoolName = selectedSchool.name;
        }
      }
      
      return newSettings;
    });
  };

  const handleSave = async () => {
    try {
      if (!settings.schoolId) {
        toast({
          title: 'Select a school',
          description: 'Please select a school first.',
          variant: 'destructive',
        });
        return;
      }

      // Upload logo if selected
      if (settings.logo) {
        const file = settings.logo as File;
        const path = `${settings.schoolId}/logo-${Date.now()}-${file.name}`;
        const uploadedPath = await uploadFile('school_logos', file, path);
        if (!uploadedPath) throw new Error('Logo upload failed');
        const publicUrl = getFileUrl('school_logos', uploadedPath);
        await updateSchoolSetting({ key: 'logo', value: { path: uploadedPath, url: publicUrl } }, settings.schoolId);
        setSettings(prev => ({ ...prev, logo: null, logoUrl: publicUrl }));
      }

      await Promise.all([
        updateSchoolSetting({ key: 'colors', value: { primary: settings.primaryColor, secondary: settings.secondaryColor } }, settings.schoolId),
        updateSchoolSetting({ key: 'contact_info', value: { email: settings.email, phone: settings.phone, address: settings.address } }, settings.schoolId),
        updateSchoolSetting({ key: 'website', value: settings.website }, settings.schoolId),
      ]);

      toast({ title: 'Settings saved', description: 'Your settings have been updated.' });
      setSettings(prev => ({ ...prev, logo: null }));
    } catch (e: any) {
      console.error('Save settings failed:', e);
      toast({ title: 'Failed to save settings', description: e?.message ?? 'Unexpected error', variant: 'destructive' });
    }
  };
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleSettingChange('logo', file);
    }
  };

  const handleSetDefaultSchool = (schoolId: string) => {
    try {
      setDefaultSchool(schoolId);
      setDefaultSchoolId(schoolId);
      setCurrentSchoolId(schoolId);
      
      // Update the selected school in settings if it's different
      if (settings.schoolId !== schoolId) {
        const selectedSchool = schoolsData?.find(school => school.id === schoolId);
        if (selectedSchool) {
          setSettings(prev => ({
            ...prev,
            schoolId: schoolId,
            schoolName: selectedSchool.name
          }));
        }
      }
      
      toast({
        title: 'Default school set',
        description: 'This school will now be your default school and will be automatically selected when you log in.',
      });
    } catch (error) {
      console.error('Failed to set default school:', error);
      toast({
        title: 'Failed to set default school',
        description: 'An error occurred while setting the default school.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveDefaultSchool = () => {
    try {
      removeDefaultSchool();
      setDefaultSchoolId(null);
      
      toast({
        title: 'Default school removed',
        description: 'No default school is set. You will need to select a school manually.',
      });
    } catch (error) {
      console.error('Failed to remove default school:', error);
      toast({
        title: 'Failed to remove default school',
        description: 'An error occurred while removing the default school.',
        variant: 'destructive',
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'website', label: 'Website', icon: Globe }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schoolSelect">Select School</Label>
              <Select
                value={settings.schoolId}
                onValueChange={(value) => handleSettingChange('schoolId', value)}
                disabled={isLoadingSchools}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingSchools ? "Loading schools..." : "Select a school"} />
                </SelectTrigger>
                <SelectContent>
                  {schoolsData?.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name} {school.code ? `(${school.code})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Default School Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Default School</Label>
                  <p className="text-sm text-muted-foreground">
                    Set a default school that will be automatically selected when you log in
                  </p>
                </div>
              </div>
              
              {defaultSchoolId ? (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">
                      {schoolsData?.find(s => s.id === defaultSchoolId)?.name || 'Unknown School'}
                    </span>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveDefaultSchool}
                    className="text-destructive hover:text-destructive"
                  >
                    <StarOff className="h-4 w-4 mr-2" />
                    Remove Default
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No default school set</p>
                  <p className="text-sm">Select a school below to set it as your default</p>
                </div>
              )}

              {/* Available Schools List */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Available Schools</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {schoolsData?.map((school) => (
                    <div
                      key={school.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isDefaultSchool(school.id) 
                          ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {isDefaultSchool(school.id) ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <div>
                          <p className="font-medium">{school.name}</p>
                          {school.code && (
                            <p className="text-sm text-muted-foreground">Code: {school.code}</p>
                          )}
                        </div>
                      </div>
                      
                      {!isDefaultSchool(school.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultSchool(school.id)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Set as Default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">School Logo</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              {settings.logo && (
                <Badge variant="secondary">
                  Logo selected: {settings.logo.name}
                </Badge>
              )}
              {settings.logoUrl && (
                <div className="mt-2">
                  <img
                    src={settings.logoUrl}
                    alt={`${settings.schoolName} logo`}
                    className="h-16 w-auto rounded-md border"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.secondaryColor}
                  onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                  placeholder="#10b981"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                placeholder="admin@school.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => handleSettingChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => handleSettingChange('address', e.target.value)}
                placeholder="School address"
              />
            </div>
          </div>
        );

      case 'website':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={settings.website}
                onChange={(e) => handleSettingChange('website', e.target.value)}
                placeholder="www.school.edu"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageTemplate title="School Settings" subtitle="Configure your school's information and preferences">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-1 mb-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-64">
              {renderTabContent()}
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6 pt-6 border-t">
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default Settings;
