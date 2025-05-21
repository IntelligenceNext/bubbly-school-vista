
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash } from 'lucide-react';

const Medium = () => {
  const [mediums] = useState([
    { id: 1, name: 'English', description: 'English as the primary medium of instruction' },
    { id: 2, name: 'Hindi', description: 'Hindi as the primary medium of instruction' },
    { id: 3, name: 'French', description: 'French as the primary medium of instruction' },
    { id: 4, name: 'Spanish', description: 'Spanish as the primary medium of instruction' },
  ]);

  return (
    <PageTemplate title="Manage Medium" subtitle="Configure teaching mediums for your school">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teaching Mediums</CardTitle>
            <CardDescription>Configure language and instruction mediums</CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Add Medium
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediums.map((medium) => (
                <TableRow key={medium.id}>
                  <TableCell className="font-medium">{medium.id}</TableCell>
                  <TableCell>{medium.name}</TableCell>
                  <TableCell>{medium.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTemplate>
  );
};

export default Medium;
