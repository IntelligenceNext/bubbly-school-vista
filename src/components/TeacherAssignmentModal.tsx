
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, UserCheck } from 'lucide-react';
import { getStaff, Staff } from '@/services/staffService';

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (teacherId: string) => Promise<void>;
  currentTeacherId?: string;
  sectionName: string;
  className: string;
}

const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  currentTeacherId,
  sectionName,
  className,
}) => {
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const staffData = await getStaff();
      // Filter to get active teachers only
      const teacherStaff = staffData.filter(staff => 
        staff.status === 'Active' && 
        (staff.role?.toLowerCase().includes('teacher') || 
         staff.designation?.toLowerCase().includes('teacher'))
      );
      setTeachers(teacherStaff);
      setFilteredTeachers(teacherStaff);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (teacherId: string) => {
    setIsAssigning(true);
    try {
      await onAssign(teacherId);
      onClose();
    } catch (error) {
      console.error('Error assigning teacher:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveAssignment = async () => {
    setIsAssigning(true);
    try {
      await onAssign(''); // Empty string to remove assignment
      onClose();
    } catch (error) {
      console.error('Error removing teacher assignment:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
          <DialogDescription>
            Select a teacher to assign to {className} - Section {sectionName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teachers by name, designation, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Assignment */}
          {currentTeacherId && (
            <div className="p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Currently Assigned</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAssignment}
                  disabled={isAssigning}
                >
                  Remove Assignment
                </Button>
              </div>
            </div>
          )}

          {/* Teachers List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading teachers...</div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No teachers found matching your search.' : 'No teachers available.'}
              </div>
            ) : (
              filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                    teacher.id === currentTeacherId ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{teacher.name}</h4>
                          {teacher.id === currentTeacherId && (
                            <Badge variant="default" className="text-xs">Currently Assigned</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{teacher.designation || 'Teacher'}</p>
                        <p className="text-sm text-gray-500">{teacher.email}</p>
                        {teacher.phone && (
                          <p className="text-sm text-gray-500">{teacher.phone}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAssign(teacher.id)}
                      disabled={isAssigning || teacher.id === currentTeacherId}
                      size="sm"
                    >
                      {teacher.id === currentTeacherId ? 'Assigned' : 'Assign'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherAssignmentModal;
