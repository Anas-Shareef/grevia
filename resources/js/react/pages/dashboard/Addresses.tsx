import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Address } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, MapPin, Loader2, X, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const DashboardAddresses = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [viewingAddress, setViewingAddress] = useState<Address | null>(null);

    interface AddressResponse {
        default_shipping: Address | null;
        default_billing: Address | null;
        addresses: Address[];
    }

    const { data: addressData, isLoading, isError, error } = useQuery<AddressResponse>({
        queryKey: ['my-addresses'],
        queryFn: () => api.get('/customer/addresses') as unknown as Promise<AddressResponse>,
        retry: 1, // Don't retry indefinitely
    });

    const addresses = addressData?.addresses || [];

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/customer/addresses/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
            toast({ title: 'Address deleted' });
        }
    });

    const saveMutation = useMutation({
        mutationFn: (data: any) => {
            return editingAddress
                ? api.put(`/customer/addresses/${editingAddress.id}`, data)
                : api.post('/customer/addresses', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
            setIsDialogOpen(false);
            setEditingAddress(null);
            toast({ title: editingAddress ? 'Address updated' : 'Address added' });
        }
    });

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isError) {
        return (
            <div className="text-center py-12 text-red-500">
                <p>Failed to load addresses.</p>
                <p className="text-sm text-gray-400 mt-2">{(error as Error)?.message}</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['my-addresses'] })} className="mt-4" variant="outline">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-2xl font-bold">My Addresses</h2>
                <Button onClick={() => { setEditingAddress(null); setIsDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Address
                </Button>
            </div>

            <AddressDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                address={editingAddress}
                onSubmit={(data) => saveMutation.mutate(data)}
                isLoading={saveMutation.isPending}
            />

            {/* View Address Dialog */}
            <Dialog open={!!viewingAddress} onOpenChange={(open) => !open && setViewingAddress(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Address Details</DialogTitle>
                        <DialogDescription>
                            View the details of your saved address.
                        </DialogDescription>
                    </DialogHeader>
                    {viewingAddress && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="font-bold text-lg">{viewingAddress.first_name} {viewingAddress.last_name}</span>
                                <div className="flex gap-2">
                                    {viewingAddress.is_default_shipping && <span className="bg-lime/20 text-lime-800 text-xs px-2 py-1 rounded">Default Shipping</span>}
                                    {viewingAddress.is_default_billing && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Default Billing</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Phone</p>
                                    <p className="font-medium">{viewingAddress.phone}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Company</p>
                                    <p className="font-medium">{viewingAddress.company || '-'}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Address Location
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Street Address</p>
                                        <p className="font-medium text-gray-900 mt-0.5">{viewingAddress.address_line_1}</p>
                                        {viewingAddress.address_line_2 && <p className="font-medium text-gray-900">{viewingAddress.address_line_2}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">City</p>
                                            <p className="font-medium text-gray-900 mt-0.5">{viewingAddress.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">State</p>
                                            <p className="font-medium text-gray-900 mt-0.5">{viewingAddress.state || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Pincode</p>
                                            <p className="font-medium text-gray-900 mt-0.5">{viewingAddress.pincode}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Country</p>
                                            <p className="font-medium text-gray-900 mt-0.5">{viewingAddress.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : addresses && addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addresses.map((address) => (
                        <Card key={address.id} className="relative group">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span className="font-semibold">{address.first_name} {address.last_name}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {address.is_default_shipping && <span className="bg-lime/20 text-lime-800 text-xs px-2 py-1 rounded">Default Shipping</span>}
                                        {address.is_default_billing && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Default Billing</span>}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="line-clamp-1">{address.address_line_1}</p>
                                    <p>{address.city}, {address.state} {address.pincode}</p>
                                    <p className="mt-2 text-gray-900">{address.phone}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 py-3 flex justify-end gap-2 border-t">
                                <Button variant="ghost" size="sm" onClick={() => setViewingAddress(address)}>
                                    <Eye className="w-4 h-4 mr-1" /> View
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                                    <Pencil className="w-4 h-4 mr-1" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(address.id)}>
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No addresses saved yet.</p>
            )}
        </div>
    );
};

// Sub-component for Dialog Form to keep main component clean
const AddressDialog = ({ open, onOpenChange, address, onSubmit, isLoading }: any) => {
    const defaultValues = {
        first_name: '', last_name: '', phone: '', company: '',
        address_line_1: '', address_line_2: '', city: '', state: '', country: 'India', pincode: '',
        is_default_shipping: false, is_default_billing: false
    };

    const [formData, setFormData] = useState(address || defaultValues);

    // Update form data when address prop changes
    React.useEffect(() => {
        setFormData(address || defaultValues);
    }, [address, open]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                    <DialogDescription>
                        {address ? 'Make changes to your address here. Click save when you\'re done.' : 'Enter your new address details below.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address_line_1">Address Line 1</Label>
                        <Input id="address_line_1" name="address_line_1" required value={formData.address_line_1} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                        <Input id="address_line_2" name="address_line_2" value={formData.address_line_2 || ''} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" required value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input id="pincode" name="pincode" required value={formData.pincode} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" value={formData.state || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" required value={formData.country} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="is_default_shipping" name="is_default_shipping" checked={formData.is_default_shipping} onCheckedChange={(c) => handleChange({ target: { name: 'is_default_shipping', type: 'checkbox', checked: c } })} />
                            <Label htmlFor="is_default_shipping" className="text-sm leading-tight">Use as default<br />shipping address</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="is_default_billing" name="is_default_billing" checked={formData.is_default_billing} onCheckedChange={(c) => handleChange({ target: { name: 'is_default_billing', type: 'checkbox', checked: c } })} />
                            <Label htmlFor="is_default_billing" className="text-sm leading-tight">Use as default<br />billing address</Label>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Update Address'}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DashboardAddresses;
