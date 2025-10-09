# MailerLite Integration Setup Guide

## 🔧 Configuration Required

Your application has been updated to use **MailerLite API v3**. Follow these steps to complete the setup.

---

## Step 1: Get Your MailerLite API Key

1. **Log into your MailerLite account** at https://www.mailerlite.com
2. Click **Integrations** in the left sidebar
3. Select **MailerLite API** (or use the Developer API section)
4. Click **"Generate new token"**
5. Give it a name (e.g., "Next Role Readiness Platform")
6. **⚠️ IMPORTANT**: Copy the API key immediately - MailerLite won't show it again!

---

## Step 2: Get Your Group IDs

You need to create 4 groups in MailerLite (one for each zone):

### Create the Groups:
1. Go to **Subscribers** → **Groups** tab in MailerLite
2. Create 4 new groups with these names:
   - **ZONE_1 - Foundation Builder** (for scores 12-29)
   - **ZONE_2 - Emerging Strategist** (for scores 30-44)
   - **ZONE_3 - Strategic Leader** (for scores 45-54)
   - **ZONE_4 - Executive Influencer** (for scores 55-60)

### Get the Group IDs:
After creating each group, you'll see a unique **Group ID** displayed. Copy all 4 IDs.

**Alternative Method - Use the API:**
```bash
curl https://connect.mailerlite.com/api/groups \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Accept: application/json"
```

This will return a JSON list of all your groups with their IDs.

---

## Step 3: Add Secrets to Replit

1. **In your Replit project**, click the **🔒 Secrets** tab (Tools → Secrets)
2. Add the following environment variables:

### Required Secrets:
```
MAILERLITE_API_KEY = your_api_key_here
MAILERLITE_GROUP_ZONE_1 = your_zone_1_group_id
MAILERLITE_GROUP_ZONE_2 = your_zone_2_group_id
MAILERLITE_GROUP_ZONE_3 = your_zone_3_group_id
MAILERLITE_GROUP_ZONE_4 = your_zone_4_group_id
```

### ⚠️ Important Notes:
- **API Key**: This is the token you generated in Step 1
- **Group IDs**: These are the unique IDs from Step 2 (they look like long numbers, e.g., "4243829086487936")
- **Case sensitive**: Use EXACTLY these variable names
- All values should be **strings** (no quotes needed in Replit Secrets)

---

## Step 4: Restart Your Application

After adding the secrets:
1. Click the **green Run button** at the top to restart the app
2. Or manually restart the "Start application" workflow

---

## Step 5: Test the Integration

1. **Complete a test assessment** as a new user
2. Go to **Admin Dashboard** (`/admin/dashboard`)
3. Click **"Approve & Send"** for the test assessment
4. **Check MailerLite**:
   - Go to **Subscribers** → check if the user was added
   - Go to **Groups** → verify they were added to the correct zone group

---

## 🔍 Troubleshooting

### If sync fails, check the server logs for:
```
❌ MailerLite sync error: ...
```

### Common Issues:

**"Unauthorized" or "Invalid API key":**
- ✅ Verify your API key is correct
- ✅ Make sure you're using a **NEW MailerLite account** (created after March 22, 2022)
- ✅ If you have a "Classic" account, you need to use the old API (contact support)

**"Group not found":**
- ✅ Double-check your Group IDs are correct
- ✅ Group IDs should be strings of numbers (e.g., "4243829086487936")

**"Rate limit exceeded":**
- ✅ MailerLite allows 120 requests/minute
- ✅ Wait 60 seconds and try again

---

## 📊 What Gets Synced?

When an admin approves an assessment, the following data is sent to MailerLite:

**Subscriber Information:**
- Email address
- Full name
- Company field: Shows zone and total score (e.g., "ZONE_2 - Score: 36")

**Group Assignment:**
- User is automatically added to their zone-specific group
- This enables targeted email campaigns based on assessment results

---

## 🎯 Next Steps

Once configured, you can:
1. **Create email campaigns** in MailerLite for each zone group
2. **Set up automation** to send personalized nurture sequences
3. **Track engagement** with assessment reports
4. **Segment further** based on scores and priorities

---

## 📝 API Version Information

- **Current**: API v3 (https://connect.mailerlite.com/api)
- **Authentication**: Bearer token
- **Documentation**: https://developers.mailerlite.com/docs/

Your application has been updated to use API v3 and will work with modern MailerLite accounts.
