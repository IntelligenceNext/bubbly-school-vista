
import React from 'react';
import { useForm } from 'react-hook-form';
import PageTemplate from '@/components/PageTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Bell, Globe, Moon, Sun } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const form = useForm({
    defaultValues: {
      language: 'en',
      theme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      desktopNotifications: true,
      calendarSync: true
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Settings updated",
      description: "Your preferences have been successfully updated.",
    });
  };

  return (
    <PageTemplate title="Account Settings" subtitle="Manage your account preferences and settings">
      <div className="space-y-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 bg-muted mb-6">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
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
                        control={form.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications</FormLabel>
                              <FormDescription>
                                Receive push notifications on your devices
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
                        control={form.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">SMS Notifications</FormLabel>
                              <FormDescription>
                                Receive text messages for important updates
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
                        control={form.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Marketing Emails</FormLabel>
                              <FormDescription>
                                Receive marketing and newsletter emails
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
                        control={form.control}
                        name="desktopNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Desktop Notifications</FormLabel>
                              <FormDescription>
                                Show desktop notifications when logged in
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
                        control={form.control}
                        name="calendarSync"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Calendar Synchronization</FormLabel>
                              <FormDescription>
                                Sync your school events with your personal calendar
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
                    </div>
                    
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" /> Save Preferences
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">
                                <div className="flex items-center">
                                  <Sun className="mr-2 h-4 w-4" />
                                  <span>Light</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="dark">
                                <div className="flex items-center">
                                  <Moon className="mr-2 h-4 w-4" />
                                  <span>Dark</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="system">System Default</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the theme for your interface
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Dashboard Layout</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                          <div className="h-24 bg-gray-100 rounded mb-2"></div>
                          <p className="text-sm font-medium">Compact View</p>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer border-primary">
                          <div className="h-24 bg-gray-100 rounded mb-2"></div>
                          <p className="text-sm font-medium">Default View</p>
                        </div>
                        <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                          <div className="h-24 bg-gray-100 rounded mb-2"></div>
                          <p className="text-sm font-medium">Expanded View</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit">Save Appearance Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="localization">
            <Card>
              <CardHeader>
                <CardTitle>Localization Settings</CardTitle>
                <CardDescription>
                  Set your language and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">
                                <div className="flex items-center">
                                  <Globe className="mr-2 h-4 w-4" />
                                  <span>English</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="es">
                                <div className="flex items-center">
                                  <Globe className="mr-2 h-4 w-4" />
                                  <span>Spanish (Español)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="fr">
                                <div className="flex items-center">
                                  <Globe className="mr-2 h-4 w-4" />
                                  <span>French (Français)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="de">
                                <div className="flex items-center">
                                  <Globe className="mr-2 h-4 w-4" />
                                  <span>German (Deutsch)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="ar">
                                <div className="flex items-center">
                                  <Globe className="mr-2 h-4 w-4" />
                                  <span>Arabic (العربية)</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select your preferred language for the interface
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Date Format</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="dateFormat1" name="dateFormat" value="MM/DD/YYYY" defaultChecked />
                            <label htmlFor="dateFormat1">MM/DD/YYYY</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="dateFormat2" name="dateFormat" value="DD/MM/YYYY" />
                            <label htmlFor="dateFormat2">DD/MM/YYYY</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="dateFormat3" name="dateFormat" value="YYYY-MM-DD" />
                            <label htmlFor="dateFormat3">YYYY-MM-DD</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Time Format</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="timeFormat1" name="timeFormat" value="12" defaultChecked />
                            <label htmlFor="timeFormat1">12-hour (AM/PM)</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="timeFormat2" name="timeFormat" value="24" />
                            <label htmlFor="timeFormat2">24-hour</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label>First Day of Week</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="weekStart1" name="weekStart" value="Sunday" defaultChecked />
                            <label htmlFor="weekStart1">Sunday</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="weekStart2" name="weekStart" value="Monday" />
                            <label htmlFor="weekStart2">Monday</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit">Save Localization Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
};

export default ProfileSettings;
