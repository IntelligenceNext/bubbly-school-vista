
import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash, Users, BookOpen, UserCheck, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SectionForm from '@/components/SectionForm';
import TeacherAssignmentModal from '@/components/TeacherAssignmentModal';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';
import { 
  getSectionsWithCapacity, 
  createSection, 
  updateSection, 
  deleteSection, 
  assignTeacher,
  SectionCapacityView, 
  CreateSectionRequest 
} from '@/services/sectionService';
import { supabase } from '@/integrations/supabase/client';

const ClassSections = () => {
  const [sections, setSections] = useState<SectionCapacityView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionCapacityView | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<SectionCapacityView | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSections();
    
    // Set up real-time subscription for sections
    const sectionsChannel = supabase
      .channel('sections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sections'
        },
        () => {
          console.log('Sections changed, refetching...');
          fetchSections();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_section_assignments'
        },
        () => {
          console.log('Student assignments changed, refetching...');
          fetchSections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sectionsChannel);
    };
  }, []);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const data = await getSectionsWithCapacity();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSection = () => {
    setSelectedSection(null);
    setIsFormOpen(true);
  };

  const handleEditSection = (section: SectionCapacityView) => {
    setSelectedSection(section);
    setIsFormOpen(true);
  };

  const handleDeleteSection = (section: SectionCapacityView) => {
    setSectionToDelete(section);
    setIsDeleteDialogOpen(true);
  };

  const handleAssignTeacher = (section: SectionCapacityView) => {
    setSelectedSection(section);
    setIsTeacherModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateSectionRequest) => {
    setIsSubmitting(true);
    try {
      if (selectedSection) {
        const success = await updateSection(selectedSection.id, data);
        if (success) {
          await fetchSections();
        }
      } else {
        const newSection = await createSection(data);
        if (newSection) {
          await fetchSections();
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherAssignment = async (teacherId: string) => {
    if (selectedSection) {
      const success = await assignTeacher(selectedSection.id, teacherId);
      if (success) {
        await fetchSections();
      }
    }
  };

  const confirmDelete = async () => {
    if (sectionToDelete) {
      const success = await deleteSection(sectionToDelete.id);
      if (success) {
        await fetchSections();
      }
      setIsDeleteDialogOpen(false);
      setSectionToDelete(null);
    }
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatCapacityText = (section: SectionCapacityView) => {
    const { total_enrolled, total_capacity, male_students, female_students, other_gender_students } = section;
    return `Total: ${total_enrolled}/${total_capacity} | ♂ ${male_students} | ♀ ${female_students} | ⚧ ${other_gender_students}`;
  };

  if (isLoading) {
    return (
      <PageTemplate title="Manage Class Sections" subtitle="Create and manage class sections">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading sections...</p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="Manage Class Sections" subtitle="Create and manage class sections with dynamic teacher assignment">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Class Sections</CardTitle>
            <CardDescription>Organize classes into sections with real-time capacity tracking</CardDescription>
          </div>
          <Button onClick={handleAddSection} className="flex items-center gap-2">
            <Plus size={16} />
            Add Section
          </Button>
        </CardHeader>
        
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No sections found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first class section.
              </p>
              <div className="mt-6">
                <Button onClick={handleAddSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Class Teacher</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-primary" />
                        <span>{section.class_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{section.section_name}</Badge>
                    </TableCell>
                    <TableCell>
                      {section.teacher_name ? (
                        <div className="flex items-center gap-2">
                          <UserCheck size={16} className="text-green-600" />
                          <div>
                            <span className="font-medium">{section.teacher_name}</span>
                            {section.teacher_designation && (
                              <div className="text-sm text-muted-foreground">
                                {section.teacher_designation}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignTeacher(section)}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            <Edit size={12} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignTeacher(section)}
                          className="flex items-center gap-2"
                        >
                          <UserPlus size={14} />
                          Assign Teacher
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{section.medium}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          <span className="text-sm">{formatCapacityText(section)}</span>
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1.5">
                          <div 
                            className={`h-2 rounded-full ${getCapacityColor(section.capacity_percentage)}`} 
                            style={{ width: `${Math.min(section.capacity_percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {section.capacity_percentage}% filled
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditSection(section)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteSection(section)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Section Form Dialog */}
      <SectionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        section={selectedSection}
        isLoading={isSubmitting}
      />

      {/* Teacher Assignment Modal */}
      <TeacherAssignmentModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onAssign={handleTeacherAssignment}
        currentTeacherId={selectedSection?.teacher_id}
        sectionName={selectedSection?.section_name || ''}
        className={selectedSection?.class_name || ''}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Section"
        description={`Are you sure you want to delete ${sectionToDelete?.class_name} - Section ${sectionToDelete?.section_name}? This action cannot be undone and will remove all student assignments.`}
      />
    </PageTemplate>
  );
};

export default ClassSections;
