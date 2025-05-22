
import React, { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, Search } from 'lucide-react';
import DataTable, { RowAction, ButtonVariant } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';

// Define schema for book form
const bookFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  author: z.string().min(3, 'Author must be at least 3 characters'),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  language: z.string().min(1, 'Please select a language'),
  category: z.string().min(1, 'Please select a category'),
  total_copies: z.number().min(1, 'At least one copy is required'),
  shelf_location: z.string().min(1, 'Shelf location is required'),
  book_cover: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

// Mock data for books
const mockBooks = [
  {
    id: "BK-001",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    publisher: "HarperCollins",
    edition: "50th Anniversary",
    language: "English",
    category: "Fiction",
    total_copies: 5,
    available_copies: 3,
    shelf_location: "F-12-A",
    added_date: "2023-01-15T09:30:00Z",
    book_cover: "https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg"
  },
  {
    id: "BK-002",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    publisher: "Scribner",
    edition: "First Edition",
    language: "English",
    category: "Fiction",
    total_copies: 3,
    available_copies: 1,
    shelf_location: "F-12-B",
    added_date: "2023-01-20T10:15:00Z",
    book_cover: "https://images-na.ssl-images-amazon.com/images/I/91pheKRx-qL.jpg"
  },
  {
    id: "BK-003",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262033848",
    publisher: "MIT Press",
    edition: "Third Edition",
    language: "English",
    category: "Computer Science",
    total_copies: 2,
    available_copies: 0,
    shelf_location: "CS-05-C",
    added_date: "2023-02-05T14:20:00Z",
    book_cover: "https://images-na.ssl-images-amazon.com/images/I/41T0iBxY8FL._SX258_BO1,204,203,200_.jpg"
  },
  {
    id: "BK-004",
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    isbn: "9781133947271",
    publisher: "Cengage Learning",
    edition: "9th Edition",
    language: "English",
    category: "Science",
    total_copies: 4,
    available_copies: 2,
    shelf_location: "S-08-D",
    added_date: "2023-02-10T11:45:00Z",
    book_cover: "https://images-na.ssl-images-amazon.com/images/I/51GR4YyFMqL._SX394_BO1,204,203,200_.jpg"
  },
  {
    id: "BK-005",
    title: "World History: Modern Era",
    author: "Elisabeth Gaynor Ellis",
    isbn: "9780131299719",
    publisher: "Prentice Hall",
    edition: "2nd Edition",
    language: "English",
    category: "History",
    total_copies: 6,
    available_copies: 4,
    shelf_location: "H-03-E",
    added_date: "2023-03-01T09:00:00Z",
    book_cover: "https://images-na.ssl-images-amazon.com/images/I/51VZGakKJFL._SX373_BO1,204,203,200_.jpg"
  }
];

const AllBooks = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isGridView, setIsGridView] = useState(false);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      edition: '',
      language: '',
      category: '',
      total_copies: 1,
      shelf_location: '',
      book_cover: '',
    }
  });

  const onSubmit = (values: BookFormValues) => {
    console.log('Form submitted:', values);
    toast({
      title: "Book created",
      description: "The book has been added to the library.",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleCoverUpload = (urls: string[]) => {
    if (urls && urls.length > 0) {
      form.setValue('book_cover', urls[0]);
    }
  };

  const availabilityColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "bubble" | "warning"> = {
    "available": "success",
    "low": "warning",
    "unavailable": "destructive"
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    if (available === 0) return { status: "unavailable", label: "Not Available" };
    if (available < total / 3) return { status: "low", label: `Low (${available})` };
    return { status: "available", label: `Available (${available})` };
  };

  const columns = [
    {
      id: "id",
      header: "Book ID",
      cell: (row: any) => <span className="font-medium">{row.id}</span>,
      isSortable: true,
      sortKey: "id"
    },
    {
      id: "title",
      header: "Title",
      cell: (row: any) => (
        <div className="flex items-center">
          {row.book_cover && (
            <div className="w-10 h-14 mr-3 overflow-hidden rounded">
              <img 
                src={row.book_cover} 
                alt={row.title}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          <div>
            <div className="font-medium">{row.title}</div>
            <div className="text-xs text-muted-foreground">{row.author}</div>
          </div>
        </div>
      ),
      isSortable: true,
      sortKey: "title"
    },
    {
      id: "category",
      header: "Category",
      cell: (row: any) => row.category,
      isSortable: true,
      sortKey: "category"
    },
    {
      id: "isbn",
      header: "ISBN",
      cell: (row: any) => <span className="text-xs">{row.isbn}</span>,
      isSortable: true,
      sortKey: "isbn"
    },
    {
      id: "availability",
      header: "Availability",
      cell: (row: any) => {
        const availability = getAvailabilityStatus(row.available_copies, row.total_copies);
        return (
          <Badge variant={availabilityColors[availability.status]}>
            {availability.label}
          </Badge>
        );
      },
      isSortable: true,
      sortKey: "available_copies"
    },
    {
      id: "shelf",
      header: "Location",
      cell: (row: any) => row.shelf_location,
      isSortable: true,
      sortKey: "shelf_location"
    }
  ];

  const actions: RowAction<any>[] = [
    {
      label: "View Details",
      onClick: (book: any) => {
        setSelectedBook(book);
        setIsViewDialogOpen(true);
      },
    },
    {
      label: "Issue Book",
      onClick: (book: any) => {
        if (book.available_copies > 0) {
          console.log("Issue book:", book);
          // Navigation to issue book page
        } else {
          toast({
            title: "Cannot issue book",
            description: "No copies available for issuing.",
            variant: "destructive"
          });
        }
      },
    },
    {
      label: "Edit Book",
      onClick: (book: any) => {
        console.log("Edit book:", book);
        // Handle edit book logic
      },
    },
    {
      label: "Delete Book",
      onClick: (book: any) => {
        console.log("Delete book:", book);
        // Handle deletion logic
      },
      variant: "destructive"
    }
  ];

  // Function to render book card for grid view
  const renderBookCard = (book: any) => {
    const availability = getAvailabilityStatus(book.available_copies, book.total_copies);
    
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow" key={book.id}>
        <div className="relative">
          <AspectRatio ratio={2/3}>
            <img 
              src={book.book_cover || "https://placehold.co/300x450?text=No+Cover"} 
              alt={book.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="absolute top-2 right-2">
            <Badge variant={availabilityColors[availability.status]}>
              {availability.label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-base line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{book.category}</span>
            <span className="text-xs">{book.id}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <PageTemplate title="All Books" subtitle="Manage library book collection">
      <div className="space-y-6">
        <PageHeader
          title="Books Catalog"
          description="View and manage all books in the library"
          primaryAction={{
            label: "Add New Book",
            onClick: () => setIsCreateDialogOpen(true),
            icon: <Plus className="h-4 w-4" />
          }}
          actions={[
            <Button 
              key="view-toggle" 
              variant="outline" 
              size="sm"
              onClick={() => setIsGridView(!isGridView)}
            >
              {isGridView ? "Table View" : "Grid View"}
            </Button>,
            <Button key="filter" variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>,
            <Button key="export" variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          ]}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {isGridView ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mockBooks.map(renderBookCard)}
            </div>
          ) : (
            <DataTable
              data={mockBooks}
              columns={columns}
              keyField="id"
              selectable={true}
              actions={actions}
              onRowClick={(book) => {
                setSelectedBook(book);
                setIsViewDialogOpen(true);
              }}
              bulkActions={[
                {
                  label: "Export Selected",
                  onClick: (selectedBooks) => console.log("Export books:", selectedBooks),
                },
                {
                  label: "Delete Selected",
                  onClick: (selectedBooks) => console.log("Delete books:", selectedBooks),
                  variant: "destructive"
                }
              ]}
            />
          )}
        </div>
        
        {/* Create Book Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Complete the form to add a new book to the library.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter book title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input placeholder="ISBN code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publisher</FormLabel>
                        <FormControl>
                          <Input placeholder="Publisher name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="edition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edition</FormLabel>
                        <FormControl>
                          <Input placeholder="Edition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                            <SelectItem value="Arabic">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fiction">Fiction</SelectItem>
                            <SelectItem value="Non-fiction">Non-fiction</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Literature">Literature</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_copies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Copies</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="shelf_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shelf Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. F-12-A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Book Cover (Optional)</FormLabel>
                  <FileUpload 
                    bucket="book-covers"
                    onUploadComplete={handleCoverUpload}
                    acceptedFileTypes={['image']}
                    maxFiles={1}
                    maxSizeInMB={5}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Book</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* View Book Dialog */}
        {selectedBook && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>{selectedBook.title}</DialogTitle>
                <DialogDescription>
                  Added on {new Date(selectedBook.added_date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  {selectedBook.book_cover ? (
                    <AspectRatio ratio={2/3} className="overflow-hidden rounded-md border">
                      <img 
                        src={selectedBook.book_cover} 
                        alt={selectedBook.title}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={2/3} className="bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">No cover available</p>
                    </AspectRatio>
                  )}
                  
                  <div className="mt-3 space-y-2">
                    {selectedBook.available_copies > 0 ? (
                      <Button className="w-full">Issue Book</Button>
                    ) : (
                      <Button className="w-full" disabled>Not Available</Button>
                    )}
                    
                    <Button variant="outline" className="w-full">Edit Details</Button>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Author</p>
                      <p>{selectedBook.author}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Category</p>
                      <p>{selectedBook.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">ISBN</p>
                      <p>{selectedBook.isbn}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Language</p>
                      <p>{selectedBook.language}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Publisher</p>
                      <p>{selectedBook.publisher}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Edition</p>
                      <p>{selectedBook.edition}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Shelf Location</p>
                      <p>{selectedBook.shelf_location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Availability</p>
                      <p>{selectedBook.available_copies} of {selectedBook.total_copies} copies available</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium mb-2">Current Status</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Copy</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: selectedBook.total_copies }).map((_, index) => {
                          const isAvailable = index < selectedBook.available_copies;
                          return (
                            <TableRow key={index}>
                              <TableCell>{`${selectedBook.id}-${index + 1}`}</TableCell>
                              <TableCell>
                                <Badge variant={isAvailable ? "success" : "destructive"}>
                                  {isAvailable ? "Available" : "Issued"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {!isAvailable && (
                                  <span>
                                    {new Date(
                                      Date.now() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageTemplate>
  );
};

export default AllBooks;
