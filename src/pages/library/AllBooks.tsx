import React, { useState, useEffect } from 'react';
import PageTemplate from '@/components/PageTemplate';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Filter, FileDown } from 'lucide-react';
import DataTable, { ButtonVariant, RowAction } from '@/components/DataTable';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import FileUpload from '@/components/FileUpload';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

// Define schema for book form
const bookFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  author: z.string().min(3, 'Author must be at least 3 characters'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
  genre: z.string().min(1, 'Please select a genre'),
  publication_date: z.string().min(1, 'Please select a publication date'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cover_image: z.string().optional(),
  publisher: z.string().min(3, 'Publisher must be at least 3 characters'),
  language: z.string().min(2, 'Language must be at least 2 characters'),
  total_pages: z.number().min(1, 'Total pages must be at least 1'),
  price: z.number().min(0, 'Price must be at least 0'),
  quantity: z.number().min(0, 'Quantity must be at least 0'),
  location_in_library: z.string().min(3, 'Location must be at least 3 characters'),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

// Mock data for books
const mockBooks = [
  {
    id: "BOOK-001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-3-16-148410-0",
    genre: "Classic",
    publication_date: "1925-04-10",
    description: "A novel about the Roaring Twenties.",
    cover_image: "gatsby.jpg",
    publisher: "Charles Scribner's Sons",
    language: "English",
    total_pages: 180,
    price: 12.99,
    quantity: 5,
    location_in_library: "A12-05"
  },
  {
    id: "BOOK-002",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    genre: "Classic",
    publication_date: "1960-07-11",
    description: "A story of racial injustice and childhood innocence.",
    cover_image: "mockingbird.jpg",
    publisher: "J. B. Lippincott & Co.",
    language: "English",
    total_pages: 281,
    price: 14.99,
    quantity: 3,
    location_in_library: "B03-12"
  },
  {
    id: "BOOK-003",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    genre: "Dystopian",
    publication_date: "1949-06-08",
    description: "A dystopian novel set in Oceania.",
    cover_image: "1984.jpg",
    publisher: "Secker & Warburg",
    language: "English",
    total_pages: 328,
    price: 11.99,
    quantity: 8,
    location_in_library: "C21-01"
  },
  {
    id: "BOOK-004",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    genre: "Romance",
    publication_date: "1813-01-28",
    description: "A romantic novel set in rural England.",
    cover_image: "pride.jpg",
    publisher: "T. Egerton, Whitehall",
    language: "English",
    total_pages: 279,
    price: 9.99,
    quantity: 6,
    location_in_library: "A12-06"
  },
  {
    id: "BOOK-005",
    title: "The Catcher in the Rye",
    author: "J. D. Salinger",
    isbn: "978-0-316-76953-0",
    genre: "Literary",
    publication_date: "1951-07-16",
    description: "A novel about teenage angst and alienation.",
    cover_image: "catcher.jpg",
    publisher: "Little, Brown and Company",
    language: "English",
    total_pages: 234,
    price: 10.99,
    quantity: 4,
    location_in_library: "B03-13"
  }
];

const AllBooks = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [books, setBooks] = useState(mockBooks);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      publication_date: '',
      description: '',
      cover_image: '',
      publisher: '',
      language: '',
      total_pages: 1,
      price: 0,
      quantity: 0,
      location_in_library: '',
    }
  });

  const onSubmit = (values: BookFormValues) => {
    console.log('Form submitted:', values);
    // Here you would typically handle the form submission, e.g., sending data to an API
    toast({
      title: "Book created",
      description: "A new book has been added to the library.",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  // Function to handle cover image upload
  const handleCoverUpload = (url: string) => {
    form.setValue('cover_image', url, { shouldValidate: true });
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
      cell: (row: any) => row.title,
      isSortable: true,
      sortKey: "title"
    },
    {
      id: "author",
      header: "Author",
      cell: (row: any) => row.author,
      isSortable: true,
      sortKey: "author"
    },
    {
      id: "genre",
      header: "Genre",
      cell: (row: any) => row.genre,
      isSortable: true,
      sortKey: "genre"
    },
    {
      id: "publication_date",
      header: "Publication Date",
      cell: (row: any) => new Date(row.publication_date).toLocaleDateString(),
      isSortable: true,
      sortKey: "publication_date"
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: (row: any) => row.quantity,
      isSortable: true,
      sortKey: "quantity"
    },
    {
      id: "location_in_library",
      header: "Location",
      cell: (row: any) => row.location_in_library,
      isSortable: true,
      sortKey: "location_in_library"
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
      label: "Edit Book",
      onClick: (book: any) => {
        console.log("Edit book:", book);
        // Handle edit logic
      },
    },
    {
      label: "Delete Book",
      onClick: (book: any) => {
        console.log("Delete book:", book);
        // Handle delete logic
      },
      variant: "destructive" as ButtonVariant
    }
  ];

  return (
    <PageTemplate title="All Books" subtitle="Manage all books in the library">
      <div className="space-y-6">
        <PageHeader
          title="Library Books"
          description="View and manage all books in the library"
          primaryAction={{
            label: "Add New Book",
            onClick: () => setIsCreateDialogOpen(true),
            icon: <Plus className="h-4 w-4" />
          }}
          actions={[
            <Button key="filter" variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>,
            <Button key="export" variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          ]}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <DataTable
            data={books}
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
                label: "Bulk Delete",
                onClick: (selectedBooks) => console.log("Bulk delete:", selectedBooks),
                variant: "destructive" as ButtonVariant
              }
            ]}
          />
        </div>

        {/* Create Book Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add a New Book</DialogTitle>
              <DialogDescription>
                Fill out the form to create a new book in the library.
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
                          <Input placeholder="Enter author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ISBN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fiction">Fiction</SelectItem>
                            <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                            <SelectItem value="Mystery">Mystery</SelectItem>
                            <SelectItem value="Thriller">Thriller</SelectItem>
                            <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                            <SelectItem value="Fantasy">Fantasy</SelectItem>
                            <SelectItem value="Romance">Romance</SelectItem>
                            <SelectItem value="Historical Fiction">Historical Fiction</SelectItem>
                            <SelectItem value="Classic">Classic</SelectItem>
                            <SelectItem value="Dystopian">Dystopian</SelectItem>
                            <SelectItem value="Literary">Literary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="publication_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publication Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Select publication date"
                            {...field}
                          />
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
                          <Input placeholder="Enter publisher" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter language" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Pages</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter total pages"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter quantity"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location_in_library"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location in Library</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter location in library"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-2">
                  <FormLabel htmlFor="book_cover">Book Cover (Optional)</FormLabel>
                  <FileUpload
                    bucket="book-covers"
                    onUploadComplete={handleCoverUpload}
                    acceptedFileTypes={['image/jpeg', 'image/png']}
                    maxFiles={1}
                    maxSizeInMB={2}
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
                <DialogTitle className="flex items-center gap-2">
                  {selectedBook.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedBook.author} - {new Date(selectedBook.publication_date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Genre</p>
                    <Badge variant="secondary">
                      {selectedBook.genre}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">ISBN</p>
                    <p className="text-sm">{selectedBook.isbn}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {selectedBook.description}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Location in Library</p>
                  <p className="text-sm">{selectedBook.location_in_library}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Price</p>
                    <p className="text-sm">${selectedBook.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Quantity</p>
                    <p className="text-sm">{selectedBook.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Total Pages</p>
                    <p className="text-sm">{selectedBook.total_pages}</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <div className="flex w-full justify-end">
                  <Button variant="outline" size="sm" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageTemplate>
  );
};

export default AllBooks;
