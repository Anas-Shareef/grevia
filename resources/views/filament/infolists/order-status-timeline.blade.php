@php
    $order = $getRecord();
    $history = $order->statusHistory()->orderBy('created_at', 'asc')->get();
@endphp

<div style="
    border:1px solid #e5e7eb;
    border-radius:12px;
    overflow:hidden;
    background:#ffffff;
">

    <div style="
        padding:18px 20px;
        font-size:20px;
        font-weight:600;
        border-bottom:1px solid #e5e7eb;
        display:flex;
        justify-content:space-between;
        align-items:center;
    ">
        Order Lifecycle

    </div>

    <table style="
        width:100%;
        border-collapse:collapse;
        text-align:center;
        font-size:14px;
    ">

        <thead>
            <tr style="background:#fafafa;">
                <th style="padding:16px;border-bottom:1px solid #e5e7eb;">Status</th>
                <th style="padding:16px;border-bottom:1px solid #e5e7eb;">Date</th>
                <th style="padding:16px;border-bottom:1px solid #e5e7eb;">Time</th>
            </tr>
        </thead>

        <tbody>
            @foreach (['pending','processing','shipped','delivered','completed'] as $status)

                @php
                    $record = $history->where('new_status', $status)->first();

                    $badge = match($status) {
                        'pending' =>
                            'background:#f3f4f6;color:#374151;',
                        'processing' =>
                            'background:#dbeafe;color:#1e40af;',
                        'shipped' =>
                            'background:#ffedd5;color:#9a3412;',
                        'delivered','completed' =>
                            'background:#d1fae5;color:#065f46;',
                    };
                @endphp

                <tr>
                    <td style="padding:18px;border-bottom:1px solid #e5e7eb;">
                        <span style="
                            padding:6px 16px;
                            border-radius:999px;
                            font-weight:500;
                            {{ $badge }}
                        ">
                            {{ ucfirst($status) }}
                        </span>
                    </td>

                    <td style="padding:18px;border-bottom:1px solid #e5e7eb;color:#6b7280;">
                        {{ $record ? $record->created_at->format('M d, Y') : '—' }}
                    </td>

                    <td style="padding:18px;border-bottom:1px solid #e5e7eb;color:#6b7280;">
                        {{ $record ? $record->created_at->format('h:i A') : '—' }}
                    </td>
                </tr>

            @endforeach
        </tbody>

    </table>
</div>
