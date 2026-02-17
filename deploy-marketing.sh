#!/bin/bash

# Marketing Automation Platform - Production Deployment Fix
# This script fixes the email_campaigns table schema and seeds demo content

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/u766289801/domains/grevia.in/public_html

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Drop and recreate email_campaigns table
echo "🔧 Fixing database schema..."
php artisan migrate:rollback --step=1 --force
php artisan migrate --force

# Seed demo content
echo "🌱 Seeding demo content..."
php artisan db:seed --class=EmailTemplateSeeder --force
php artisan db:seed --class=DemoMarketingUsersSeeder --force
php artisan db:seed --class=EmailCampaignSeeder --force

# Clear all caches
echo "🧹 Clearing caches..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

echo "✅ Deployment complete!"
echo ""
echo "📧 Test your marketing platform:"
echo "1. Login to https://grevia.in/admin"
echo "2. Go to Marketing → Email Templates"
echo "3. Click 'Send Test' on any template"
echo "4. Check your inbox!"
echo ""
echo "🎉 Marketing automation platform is ready!"
