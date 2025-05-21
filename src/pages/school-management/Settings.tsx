import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { School, Setting, getSchools, getSettings, createOrUpdateSetting, deleteSetting } from '@/services/schoolManagementService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, MoreHorizontal, Plus, Settings2, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

// Schema configuration for different types of settings
const settingConfigs = {
  grading_policy: {
    title: "Grading Policy",
    description: "Configure the grading scale and passing percentages",
    schema: z.object({
      scale: z.array(z.object({
        grade: z.string(),
        min_percentage: z.number().min(0).max(100),
        max_percentage: z.number().min(0).max(100),
      })),
      passing_percentage: z.number().min(0).max(100),
    }),
    defaultValue: {
      scale: [
        { grade: "A", min_percentage: 90, max_percentage: 100 },
        { grade: "B", min_percentage: 80, max_percentage: 89 },
        { grade: "C", min_percentage: 70, max_percentage: 79 },
        { grade: "D", min_percentage: 60, max_percentage: 69 },
        { grade: "F", min_percentage: 0, max_percentage: 59 },
      ],
      passing_percentage: 60,
    },
  },
  timezone: {
    title: "Timezone",
    description: "Set the school's timezone for scheduling and reporting",
    schema: z.object({
      timezone: z.string(),
    }),
    defaultValue: {
      timezone: "UTC",
    },
  },
  language_medium: {
    title: "Language Medium",
    description: "Configure primary and secondary languages for instruction",
    schema: z.object({
      primary: z.string(),
      secondary: z.array(z.string()).optional(),
    }),
    defaultValue: {
      primary: "English",
      secondary: [""],
    },
  },
  term_structure: {
    title: "Term Structure",
    description: "Define the terms or semesters within an academic session",
    schema: z.object({
      terms: z.array(z.object({
        name: z.string(),
        weight: z.number().min(0).max(100),
      })),
    }),
    defaultValue: {
      terms: [
        { name: "Term 1", weight: 33 },
        { name: "Term 2", weight: 33 },
        { name: "Term 3", weight: 34 },
      ],
    },
  },
  attendance_policy: {
    title: "Attendance Policy",
    description: "Configure attendance tracking and reporting thresholds",
    schema: z.object({
      minimum_attendance: z.number().min(0).max(100),
      track_late_arrivals: z.boolean(),
      excuse_requires_document: z.boolean(),
    }),
    defaultValue: {
      minimum_attendance: 75,
      track_late_arrivals: true,
      excuse_requires_document: false,
    },
  },
};

const settingTypeSchema = z.object({
  school_id: z.string().min(1, "School is required"),
  key: z.enum([
    "grading_policy",
    "timezone", 
    "language_medium", 
    "term_structure",
    "attendance_policy"
  ]),
});

type SettingTypeFormValues = z.infer<typeof settingTypeSchema>;

// Dynamic form schema based on setting type
const getDynamicSchema = (key: keyof typeof settingConfigs) => {
  return settingConfigs[key].schema;
};

const SettingsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [settingType, setSettingType] = useState<keyof typeof settingConfigs | "">("");
  const [isNewSettingModalOpen, setIsNewSettingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<Setting | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [currentEditSetting, setCurrentEditSetting] = useState<Setting | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const queryClient = useQueryClient();

  const settingTypeForm = useForm<SettingTypeFormValues>({
    resolver: zodResolver(settingTypeSchema),
    defaultValues: {
      school_id: "",
      key: "grading_policy"
    },
  });

  const [dynamicForm, setDynamicForm] = useState<any>(null);

  useEffect(() => {
    if (settingType && settingConfigs[settingType as keyof typeof settingConfigs]) {
      const config = settingConfigs[settingType as keyof typeof settingConfigs];
      const schema = getDynamicSchema(settingType as keyof typeof settingConfigs);
      
      const newForm = useForm({
        resolver: zodResolver(schema),
        defaultValues: currentEditSetting 
          ? currentEditSetting.value 
          : config.defaultValue,
      });
      
      setDynamicForm(newForm);
    }
  }, [settingType, currentEditSetting]);

  const { data: schoolsData } = useQuery({
    queryKey: ['schools-settings'],
    queryFn: async () => {
      const result = await getSchools();
      
      if (result && result.data.length > 0 && !selectedSchool) {
        setSelectedSchool(result.data[0].id);
      }
      
      setSchools(result.data);
      return result;
    },
  });

  const { data: settings = [], refetch: refetchSettings } = useQuery({
    queryKey: ['settings', selectedSchool],
    queryFn: async () => {
      if (!selectedSchool) return [];
      setIsLoading(true);
      try {
        const data = await getSettings({ schoolId: selectedSchool });
        return data || [];
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An error occurred while fetching settings",
          variant: "destructive"
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!selectedSchool,
  });

  const handleNewSetting = () => {
    setIsEditMode(false);
    setCurrentEditSetting(null);
    settingTypeForm.reset({
      school_id: selectedSchool,
      key: "grading_policy"
    });
    setSettingType("grading_policy");
    setIsNewSettingModalOpen(true);
  };

  const handleEditSetting = (setting: Setting) => {
    setIsEditMode(true);
    setCurrentEditSetting(setting);
    settingTypeForm.reset({
      school_id: setting.school_id,
      key: setting.key as any
    });
    setSettingType(setting.key as keyof typeof settingConfigs);
    setIsNewSettingModalOpen(true);
  };

  const handleDeleteSetting = (setting: Setting) => {
    setSettingToDelete(setting);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSetting = async () => {
    if (!settingToDelete) return;
    
    try {
      await deleteSetting(settingToDelete.id!);
      refetchSettings();
      setIsDeleteModalOpen(false);
      setSettingToDelete(null);
      
      toast({
        title: "Setting deleted",
        description: "The setting has been deleted successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete setting",
        variant: "destructive"
      });
    }
  };

  const onSelectSettingType = (data: SettingTypeFormValues) => {
    const settingExists = settings.find(s => s.key === data.key);
    if (settingExists && !isEditMode) {
      toast({
        title: "Setting already exists",
        description: `A setting with key "${data.key}" already exists for this school.`,
        variant: "destructive"
      });
      return;
    }
    
    setSettingType(data.key);
  };

  const onSubmitSetting = async (data: any) => {
    if (!selectedSchool || !settingType) return;
    
    try {
      await createOrUpdateSetting(
        selectedSchool,
        settingType,
        data
      );
      
      setIsNewSettingModalOpen(false);
      refetchSettings();
      
      toast({
        title: isEditMode ? "Setting updated" : "Setting created",
        description: `The ${settingConfigs[settingType as keyof typeof settingConfigs].title} setting has been ${isEditMode ? "updated" : "created"}.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the setting",
        variant: "destructive"
      });
    }
  };

  const getSettingsByCategory = (category: string) => {
    if (!settings) return [];
    
    switch (category) {
      case "general":
        return settings.filter(s => ["grading_policy", "timezone", "language_medium"].includes(s.key));
      case "attendance":
        return settings.filter(s => ["attendance_policy"].includes(s.key));
      case "terms":
        return settings.filter(s => ["term_structure"].includes(s.key));
      case "custom":
        return settings.filter(s => !["grading_policy", "timezone", "language_medium", "attendance_policy", "term_structure"].includes(s.key));
      default:
        return [];
    }
  };

  const renderSettingCard = (setting: Setting) => {
    const config = settingConfigs[setting.key as keyof typeof settingConfigs];
    if (!config) return null;
    
    return (
      <Card key={setting.id} className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditSetting(setting)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteSetting(setting)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] rounded-md">
            <pre className="text-xs overflow-auto p-2 bg-muted rounded">
              {JSON.stringify(setting.value, null, 2)}
            </pre>
          </ScrollArea>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <div>Key: {setting.key}</div>
            <div>Updated: {format(new Date(setting.updated_at), "MMM d, yyyy")}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Dynamic form rendering based on setting type
  const renderDynamicForm = () => {
    if (!settingType) return null;
    
    const config = settingConfigs[settingType as keyof typeof settingConfigs];
    
    switch (settingType) {
      case "grading_policy":
        return (
          <Form {...dynamicForm}>
            <form onSubmit={dynamicForm.handleSubmit(onSubmitSetting)} className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Grading Scale</h3>
                <div className="space-y-4">
                  {dynamicForm.watch("scale")?.map((_, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 items-center">
                      <FormField
                        control={dynamicForm.control}
                        name={`scale.${index}.grade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Grade</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="A, B, C..." />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={dynamicForm.control}
                        name={`scale.${index}.min_percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Min %</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min={0} 
                                max={100}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                value={field.value}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={dynamicForm.control}
                        name={`scale.${index}.max_percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Max %</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min={0} 
                                max={100}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                value={field.value}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <FormField
                control={dynamicForm.control}
                name="passing_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passing Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min={0} 
                        max={100}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>Minimum percentage required to pass</FormDescription>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Settings</Button>
              </DialogFooter>
            </form>
          </Form>
        );
      case "timezone":
        return (
          <Form {...dynamicForm}>
            <form onSubmit={dynamicForm.handleSubmit(onSubmitSetting)} className="space-y-4">
              <FormField
                control={dynamicForm.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">GMT</SelectItem>
                        <SelectItem value="Asia/Tokyo">Japan Time</SelectItem>
                        <SelectItem value="Asia/Shanghai">China Time</SelectItem>
                        <SelectItem value="Asia/Kolkata">India Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This will be used for all scheduling and reporting
                    </FormDescription>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Settings</Button>
              </DialogFooter>
            </form>
          </Form>
        );
      case "language_medium":
        return (
          <Form {...dynamicForm}>
            <form onSubmit={dynamicForm.handleSubmit(onSubmitSetting)} className="space-y-4">
              <FormField
                control={dynamicForm.control}
                name="primary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Primary language of instruction
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={dynamicForm.control}
                name="secondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Languages</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Spanish, French (comma separated)" 
                        value={field.value?.join(", ") || ""} 
                        onChange={(e) => {
                          const values = e.target.value
                            .split(",")
                            .map(v => v.trim())
                            .filter(Boolean);
                          field.onChange(values);
                        }} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional secondary languages supported
                    </FormDescription>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Settings</Button>
              </DialogFooter>
            </form>
          </Form>
        );
      case "term_structure":
        return (
          <Form {...dynamicForm}>
            <form onSubmit={dynamicForm.handleSubmit(onSubmitSetting)} className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Terms/Semesters</h3>
                <div className="space-y-4">
                  {dynamicForm.watch("terms")?.map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center">
                      <FormField
                        control={dynamicForm.control}
                        name={`terms.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Term Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Fall Semester" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={dynamicForm.control}
                        name={`terms.${index}.weight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Weight (%)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min={0} 
                                max={100}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                value={field.value}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: Weights should add up to 100%
                </p>
              </div>
              <DialogFooter>
                <Button type="submit">Save Settings</Button>
              </DialogFooter>
            </form>
          </Form>
        );
      case "attendance_policy":
        return (
          <Form {...dynamicForm}>
            <form onSubmit={dynamicForm.handleSubmit(onSubmitSetting)} className="space-y-4">
              <FormField
                control={dynamicForm.control}
                name="minimum_attendance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Attendance Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min={0} 
                        max={100}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Required attendance percentage for students
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={dynamicForm.control}
                name="track_late_arrivals"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Track Late Arrivals</FormLabel>
                      <FormDescription>
                        Track when students arrive late to class
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={dynamicForm.control}
                name="excuse_requires_document"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Require Documentation for Excused Absences</FormLabel>
                      <FormDescription>
                        Require documentation for absences to be excused
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Settings</Button>
              </DialogFooter>
            </form>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <PageTemplate title="Settings" subtitle="Configure school management settings">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>School</CardTitle>
              <CardDescription>Select a school to manage its settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSchool}
                onValueChange={(value) => setSelectedSchool(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id!}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-3/4">
          {!selectedSchool ? (
            <Card>
              <CardContent className="pt-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No school selected</AlertTitle>
                  <AlertDescription>
                    Please select a school to manage settings.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  School Settings 
                  <Badge variant="outline" className="ml-2">
                    {schools?.find(s => s.id === selectedSchool)?.name}
                  </Badge>
                </h2>
                <Button onClick={handleNewSetting}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Setting
                </Button>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="terms">Term Structure</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  {getSettingsByCategory("general").length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <Settings2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No general settings</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add grading policy, timezone, or language settings
                          </p>
                          <Button className="mt-4" onClick={handleNewSetting}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Setting
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    getSettingsByCategory("general").map(renderSettingCard)
                  )}
                </TabsContent>
                
                <TabsContent value="attendance">
                  {getSettingsByCategory("attendance").length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <Settings2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No attendance settings</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Configure attendance policies
                          </p>
                          <Button className="mt-4" onClick={handleNewSetting}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Setting
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    getSettingsByCategory("attendance").map(renderSettingCard)
                  )}
                </TabsContent>
                
                <TabsContent value="terms">
                  {getSettingsByCategory("terms").length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <Settings2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No term structure settings</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Define terms or semesters for the academic year
                          </p>
                          <Button className="mt-4" onClick={handleNewSetting}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Setting
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    getSettingsByCategory("terms").map(renderSettingCard)
                  )}
                </TabsContent>
                
                <TabsContent value="custom">
                  {getSettingsByCategory("custom").length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <Settings2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No custom settings</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Define custom settings for your school
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    getSettingsByCategory("custom").map(renderSettingCard)
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* New Setting Dialog */}
      <Dialog open={isNewSettingModalOpen} onOpenChange={setIsNewSettingModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Setting" : "Add New Setting"}
            </DialogTitle>
          </DialogHeader>
          
          {settingType === "" ? (
            <Form {...settingTypeForm}>
              <form onSubmit={settingTypeForm.handleSubmit(onSelectSettingType)} className="space-y-4">
                <FormField
                  control={settingTypeForm.control}
                  name="school_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem key={school.id} value={school.id!}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingTypeForm.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setting Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select setting type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(settingConfigs).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Continue</Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            renderDynamicForm()
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the{" "}
              <span className="font-semibold">
                {settingToDelete?.key && settingConfigs[settingToDelete.key as keyof typeof settingConfigs]?.title || settingToDelete?.key}
              </span>{" "}
              setting?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteSetting}
            >
              Delete Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

export default SettingsPage;
