
import React from 'react';
import { useForm } from 'react-hook-form';
import PageTemplate from '@/components/PageTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Save } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const form = useForm({
    defaultValues: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'admin@school.edu',
      phone: '(555) 123-4567',
      jobTitle: 'Mathematics Teacher',
      department: 'Mathematics',
      employmentType: 'Full-time',
      joinDate: '2022-08-15',
      bio: 'Experienced educator with over 10 years of teaching mathematics at secondary level.',
      address: '123 School Lane, Education City, EC 12345',
      gender: 'male',
      dob: '1985-05-22'
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <PageTemplate title="My Profile" subtitle="View and edit your personal information">
      <div className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-muted mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src="/profile-placeholder.jpg" alt="Profile picture" />
                      <AvatarFallback className="text-2xl bg-gradient-bubble text-white">JS</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dob"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biography</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormDescription>A brief description of yourself</FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full md:w-auto">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Details about your professional role and responsibilities</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employmentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Temporary">Temporary</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="joinDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Join Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qualifications">
            <Card>
              <CardHeader>
                <CardTitle>Qualifications & Skills</CardTitle>
                <CardDescription>Your educational background, certifications, and specialized skills</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for qualifications tab - to be implemented</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
                <CardDescription>Your employment history, contract details, and role assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for employment tab - to be implemented</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>People to contact in case of emergency</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for emergency contacts tab - to be implemented</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Customize your user experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for preferences tab - to be implemented</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
};

export default ProfilePage;
