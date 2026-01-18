<?php

namespace App\Policies;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CustomerAddressPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return str_ends_with($user->email, '@grevia.com');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CustomerAddress $customerAddress): bool
    {
        return str_ends_with($user->email, '@grevia.com') || $user->id === $customerAddress->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Controller handles logic, but purely for Filament: false for admin if we want strict read-only
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CustomerAddress $customerAddress): bool
    {
        return false;
    }
}
