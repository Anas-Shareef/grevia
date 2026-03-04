<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class AdminExportController extends Controller
{
    /**
     * Export Users / Customers as Excel-compatible CSV
     */
    public function users(Request $request)
    {
        $users = User::query()
            ->select('id', 'name', 'email', 'phone', 'created_at', 'is_blocked')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'customers_' . now()->format('Y-m-d_H-i') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
        ];

        $callback = function () use ($users) {
            $output = fopen('php://output', 'w');
            // BOM for Excel UTF-8 compatibility
            fputs($output, "\xEF\xBB\xBF");

            // Header row
            fputcsv($output, ['ID', 'Name', 'Email', 'Phone', 'Status', 'Registered At']);

            foreach ($users as $user) {
                fputcsv($output, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone ?? '',
                    $user->is_blocked ? 'Blocked' : 'Active',
                    $user->created_at?->format('d M Y H:i'),
                ]);
            }

            fclose($output);
        };

        return response()->streamDownload($callback, $filename, $headers);
    }

    /**
     * Export Products as Excel-compatible CSV
     */
    public function products(Request $request)
    {
        $products = Product::with('category')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'products_' . now()->format('Y-m-d_H-i') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
        ];

        $callback = function () use ($products) {
            $output = fopen('php://output', 'w');
            fputs($output, "\xEF\xBB\xBF");

            fputcsv($output, [
                'ID', 'Name', 'Category', 'Price (₹)', 'Original Price (₹)',
                'Rating', 'In Stock', 'Featured', 'Badge', 'Created At'
            ]);

            foreach ($products as $product) {
                fputcsv($output, [
                    $product->id,
                    $product->name,
                    $product->category?->name ?? '',
                    $product->price,
                    $product->original_price ?? '',
                    $product->rating ?? '',
                    $product->in_stock ? 'Yes' : 'No',
                    $product->is_featured ? 'Yes' : 'No',
                    $product->badge ?? '',
                    $product->created_at?->format('d M Y H:i'),
                ]);
            }

            fclose($output);
        };

        return response()->streamDownload($callback, $filename, $headers);
    }

    /**
     * Export Contact Messages as Excel-compatible CSV (detailed)
     */
    public function contactMessages(Request $request)
    {
        $messages = ContactMessage::query()
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'contact_messages_' . now()->format('Y-m-d_H-i') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
        ];

        $callback = function () use ($messages) {
            $output = fopen('php://output', 'w');
            fputs($output, "\xEF\xBB\xBF");

            fputcsv($output, [
                'ID', 'Full Name', 'Email', 'Phone', 'Subject',
                'Message', 'Status', 'Received At'
            ]);

            foreach ($messages as $msg) {
                fputcsv($output, [
                    $msg->id,
                    $msg->full_name,
                    $msg->email,
                    $msg->phone ?? '',
                    $msg->subject ?? '',
                    $msg->message ?? '',
                    ucfirst($msg->status ?? 'new'),
                    $msg->created_at?->format('d M Y H:i'),
                ]);
            }

            fclose($output);
        };

        return response()->streamDownload($callback, $filename, $headers);
    }
}
