import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface Address {
    id: number;
    first_name: string;
    last_name: string;
    company?: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state?: string;
    country: string;
    pincode: string;
    is_default_billing: boolean;
    is_default_shipping: boolean;
}

const AddressesPage = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({ country: 'India' });
    const { toast } = useToast();

    const fetchAddresses = async () => {
        try {
            const response = await api.getAddresses();
            setAddresses(response.addresses || []);
        } catch (error) {
            console.error("Failed to fetch addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await api.updateAddress(editingAddress.id, formData);
                toast({ title: "Address updated successfully" });
            } else {
                await api.createAddress(formData);
                toast({ title: "Address added successfully" });
            }
            setIsDialogOpen(false);
            setEditingAddress(null);
            setFormData({ country: 'India' });
            fetchAddresses();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await api.deleteAddress(id);
            toast({ title: "Address deleted" });
            fetchAddresses();
        } catch (error) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    const openEdit = (addr: Address) => {
        setEditingAddress(addr);
        setFormData(addr);
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setEditingAddress(null);
        setFormData({ country: 'India', is_default_shipping: false, is_default_billing: false });
        setIsDialogOpen(true);
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Addresses</h2>
                <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> <span className="hidden sm:inline">Add New Address</span><span className="sm:hidden">Add</span></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((addr) => (
                    <Card key={addr.id} className="relative group">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <CardTitle className="text-lg">{addr.first_name} {addr.last_name}</CardTitle>
                                    <div className="flex flex-wrap gap-2">
                                        {addr.is_default_shipping && <Badge>Default Shipping</Badge>}
                                        {addr.is_default_billing && <Badge variant="outline">Default Billing</Badge>}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(addr)}><Edit2 className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(addr.id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            {addr.company && <CardDescription>{addr.company}</CardDescription>}
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600 space-y-1">
                            <p>{addr.address_line_1}</p>
                            {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                            <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p>{addr.country}</p>
                            <p className="mt-2 flex items-center gap-2"><span className="font-medium text-gray-900">Phone:</span> {addr.phone}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input id="first_name" value={formData.first_name || ''} onChange={e => setFormData({ ...formData, first_name: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input id="last_name" value={formData.last_name || ''} onChange={e => setFormData({ ...formData, last_name: e.target.value })} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="company">Company (Optional)</Label>
                                <Input id="company" value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address_line_1">Address Line 1</Label>
                            <Input id="address_line_1" value={formData.address_line_1 || ''} onChange={e => setFormData({ ...formData, address_line_1: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                            <Input id="address_line_2" value={formData.address_line_2 || ''} onChange={e => setFormData({ ...formData, address_line_2: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" value={formData.state || ''} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" value={formData.country || 'India'} onChange={e => setFormData({ ...formData, country: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" value={formData.pincode || ''} onChange={e => setFormData({ ...formData, pincode: e.target.value })} required />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="default_shipping" checked={formData.is_default_shipping} onCheckedChange={(c) => setFormData({ ...formData, is_default_shipping: c as boolean })} />
                                <Label htmlFor="default_shipping">Use as default shipping address</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="default_billing" checked={formData.is_default_billing} onCheckedChange={(c) => setFormData({ ...formData, is_default_billing: c as boolean })} />
                                <Label htmlFor="default_billing">Use as default billing address</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingAddress ? 'Update Address' : 'Save Address'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddressesPage;
