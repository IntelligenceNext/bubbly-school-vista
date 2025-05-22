
import React from 'react';
import { useForm } from 'react-hook-form';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Key, AlertCircle, Shield, Smartphone, History, Save } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const SecurityPage = () => {
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const securityForm = useForm({
    defaultValues: {
      twoFactorAuth: false,
      loginNotifications: true,
      unusualActivityAlerts: true,
      sessionTimeout: '30',
      rememberDevices: true
    }
  });

  const onPasswordSubmit = (data: any) => {
    console.log('Password change data:', data);
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    passwordForm.reset();
  };

  const onSecuritySubmit = (data: any) => {
    console.log('Security settings data:', data);
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been updated.",
    });
  };

  return (
    <PageTemplate title="Security Settings" subtitle="Manage your account security and authentication options">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password regularly to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your current password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your new password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your new password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Update Password</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Secure your account with two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={securityForm.control}
              name="twoFactorAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Two-Factor Authentication (2FA)</FormLabel>
                    <FormDescription>
                      Add an extra layer of security to your account
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
            
            {securityForm.watch('twoFactorAuth') && (
              <div className="space-y-4 pl-4 border-l-2 border-primary">
                <div>
                  <h4 className="font-medium mb-2">Choose 2FA Method</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="2fa-app" name="2faMethod" value="app" defaultChecked />
                      <label htmlFor="2fa-app">Authenticator App</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="2fa-sms" name="2faMethod" value="sms" />
                      <label htmlFor="2fa-sms">SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="2fa-email" name="2faMethod" value="email" />
                      <label htmlFor="2fa-email">Email</label>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    After enabling 2FA, you'll be logged out and will need to log back in using your new authentication method.
                  </AlertDescription>
                </Alert>
                
                <Button className="mt-4">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Set Up Two-Factor Authentication
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Security Alerts & Preferences
            </CardTitle>
            <CardDescription>
              Manage your security notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                <FormField
                  control={securityForm.control}
                  name="loginNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Login Notifications</FormLabel>
                        <FormDescription>
                          Receive email notifications when someone logs into your account
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
                  control={securityForm.control}
                  name="unusualActivityAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Unusual Activity Alerts</FormLabel>
                        <FormDescription>
                          Get notified of suspicious activity or login attempts
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
                
                <div className="rounded-lg border p-4">
                  <Label>Session Timeout (minutes)</Label>
                  <div className="flex items-center mt-2">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={securityForm.watch('sessionTimeout')}
                      onChange={(e) => securityForm.setValue('sessionTimeout', e.target.value)}
                      className="flex-1 mr-4"
                    />
                    <span className="w-12 text-center">{securityForm.watch('sessionTimeout')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Automatically log out after period of inactivity
                  </p>
                </div>
                
                <FormField
                  control={securityForm.control}
                  name="rememberDevices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Remember Devices</FormLabel>
                        <FormDescription>
                          Stay logged in on trusted devices
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
                
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              View and manage your current active sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg divide-y">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Windows 11 • Chrome • New York, USA</p>
                    <p className="text-xs text-muted-foreground mt-1">Active now</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Current
                  </div>
                </div>
                
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-muted-foreground">iOS 16 • iPhone 13 • Boston, USA</p>
                    <p className="text-xs text-muted-foreground mt-1">Active 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
                
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Tablet</p>
                    <p className="text-sm text-muted-foreground">iPadOS • iPad Pro • New York, USA</p>
                    <p className="text-xs text-muted-foreground mt-1">Active 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="destructive">Sign Out All Other Devices</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};

export default SecurityPage;
