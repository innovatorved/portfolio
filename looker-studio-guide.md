# Looker Studio Reports Guide

A comprehensive guide to create analytics reports using your GA4 custom events and page view data.

---

## 🚀 Quick Start: Connect GA4 to Looker Studio

### Step 1: Access Looker Studio
1. Go to [lookerstudio.google.com](https://lookerstudio.google.com)
2. Sign in with the same Google account that has access to your GA4 property

### Step 2: Create New Report
1. Click **"+ Create"** → **"Report"**
2. Select **"Google Analytics"** as data source
3. Choose your GA4 property (portfolio website)
4. Click **"Add"** to add the data source
5. Click **"Add to Report"** to start building

---

## 📊 Available Dimensions & Metrics

### Custom Event Dimensions
| Dimension Name | Description | Use In Reports |
|---------------|-------------|----------------|
| `cert_title` | Certification name clicked | Certification Report |
| `issuer` | Certification issuer | Certification Report |
| `link_text` | Navigation/footer link text | Navigation Report |
| `link_url` | Clicked URL | All click reports |
| `platform` | Social media platform | Social Report |
| `post_slug` | Blog post URL slug | Blog Report |
| `post_title` | Blog post title | Blog Report |
| `project_slug` | Project URL slug | Project Report |
| `project_title` | Project name | Project Report |
| `percent` | Scroll depth percentage | Scroll Analysis |

### Key Metrics
| Metric | Description |
|--------|-------------|
| `Event count` | Total number of events |
| `Total users` | Unique users |
| `Sessions` | Total sessions |
| `New users` | First-time visitors |
| `Engagement rate` | Engaged sessions percentage |
| `Average engagement time` | Time spent on site |

---

## 📈 Report 1: Website Overview Dashboard

### Purpose
High-level view of overall website performance.

### Creation Steps

1. **Add Date Range Control**
   - Click **"Add a control"** → **"Date range control"**
   - Position at top-right of report

2. **Add Scorecard: Total Page Views**
   - Click **"Add a chart"** → **"Scorecard"**
   - Metric: `Event count`
   - Filter: Event name = `page_view`

3. **Add Scorecard: Total Users**
   - Add another Scorecard
   - Metric: `Total users`

4. **Add Scorecard: Sessions**
   - Metric: `Sessions`

5. **Add Time Series Chart: Traffic Over Time**
   - Click **"Add a chart"** → **"Time series chart"**
   - Dimension: `Date`
   - Metric: `Sessions`

6. **Add Pie Chart: Device Category**
   - Click **"Add a chart"** → **"Pie chart"**
   - Dimension: `Device category`
   - Metric: `Sessions`

7. **Add Table: Top Pages**
   - Click **"Add a chart"** → **"Table"**
   - Dimension: `Page path`
   - Metrics: `Event count`, `Total users`
   - Sort by: Event count (descending)

8. **Add Geo Map: Visitors by Country**
   - Click **"Add a chart"** → **"Geo chart"**
   - Dimension: `Country`
   - Metric: `Sessions`

---

## 📈 Report 2: Navigation Analytics

### Purpose
Understand how users navigate your site.

### Creation Steps

1. **Add Bar Chart: Top Navigation Clicks**
   - Chart type: **Horizontal bar chart**
   - Dimension: `link_text`
   - Metric: `Event count`
   - Filter: Event name = `nav_click`

2. **Add Table: Navigation Link Details**
   - Dimension: `link_text`, `link_url`
   - Metric: `Event count`
   - Filter: Event name = `nav_click`

3. **Add Bar Chart: Footer Clicks**
   - Chart type: **Horizontal bar chart**
   - Dimension: `link_text`
   - Metric: `Event count`
   - Filter: Event name = `footer_click`

4. **Add Time Series: Navigation Trends**
   - Dimension: `Date`
   - Breakdown dimension: `link_text`
   - Metric: `Event count`
   - Filter: Event name = `nav_click`

---

## 📈 Report 3: Blog Engagement

### Purpose
Track which blog posts attract the most interest.

### Creation Steps

1. **Add Table: Blog Post Performance**
   - Dimensions: `post_title`, `post_slug`
   - Metric: `Event count`
   - Filter: Event name = `blog_post_click`
   - Sort: Event count (descending)

2. **Add Bar Chart: Top 10 Blog Posts**
   - Chart type: **Horizontal bar chart**
   - Dimension: `post_title`
   - Metric: `Event count`
   - Filter: Event name = `blog_post_click`
   - Limit: Top 10

3. **Add Time Series: Blog Clicks Over Time**
   - Dimension: `Date`
   - Metric: `Event count`
   - Filter: Event name = `blog_post_click`

4. **Add Scorecard: Total Blog Clicks**
   - Metric: `Event count`
   - Filter: Event name = `blog_post_click`

---

## 📈 Report 4: Project Portfolio Analytics

### Purpose
Measure interest in your projects.

### Creation Steps

1. **Add Table: Project Performance**
   - Dimensions: `project_title`, `project_slug`
   - Metric: `Event count`
   - Filter: Event name = `project_click`

2. **Add Pie Chart: Project Click Distribution**
   - Dimension: `project_title`
   - Metric: `Event count`
   - Filter: Event name = `project_click`

3. **Add Time Series: Project Interest Trends**
   - Dimension: `Date`
   - Breakdown dimension: `project_title`
   - Metric: `Event count`
   - Filter: Event name = `project_click`

---

## 📈 Report 5: Social Media Engagement

### Purpose
Track which social platforms drive the most clicks.

### Creation Steps

1. **Add Pie Chart: Clicks by Platform**
   - Dimension: `platform`
   - Metric: `Event count`
   - Filter: Event name = `social_click`

2. **Add Bar Chart: Platform Comparison**
   - Chart type: **Column chart**
   - Dimension: `platform`
   - Metric: `Event count`
   - Filter: Event name = `social_click`

3. **Add Table: Social Link Details**
   - Dimensions: `platform`, `link_url`
   - Metric: `Event count`
   - Filter: Event name = `social_click`

4. **Add Time Series: Social Engagement Trends**
   - Dimension: `Date`
   - Breakdown dimension: `platform`
   - Metric: `Event count`
   - Filter: Event name = `social_click`

---

## 📈 Report 6: Certification Engagement

### Purpose
See which certifications get the most attention.

### Creation Steps

1. **Add Table: Certification Clicks**
   - Dimensions: `cert_title`, `issuer`
   - Metric: `Event count`
   - Filter: Event name = `certification_credential_click`

2. **Add Bar Chart: Top Certifications**
   - Dimension: `cert_title`
   - Metric: `Event count`
   - Filter: Event name = `certification_credential_click`

3. **Add Pie Chart: Clicks by Issuer**
   - Dimension: `issuer`
   - Metric: `Event count`
   - Filter: Event name = `certification_credential_click`

---

## 📈 Report 7: Scroll Depth Analysis

### Purpose
Understand how deeply users engage with your content.

### Creation Steps

1. **Add Stacked Bar Chart: Scroll Depth Distribution**
   - Dimension: `percent`
   - Metric: `Event count`
   - Filter: Event name = `scroll_depth`

2. **Add Table: Page Scroll Performance**
   - Dimensions: `page_path`, `percent`
   - Metric: `Event count`
   - Filter: Event name = `scroll_depth`

3. **Add Scorecard: Deep Scrollers (100%)**
   - Metric: `Event count`
   - Filter: Event name = `scroll_depth` AND percent = `100`

---

## 📈 Report 8: Contact & Conversions

### Purpose
Track contact engagement and outbound links.

### Creation Steps

1. **Add Scorecard: Email Clicks**
   - Metric: `Event count`
   - Filter: Event name = `contact_email_click`

2. **Add Time Series: Contact Trends**
   - Dimension: `Date`
   - Metric: `Event count`
   - Filter: Event name = `contact_email_click`

3. **Add Table: Outbound Link Clicks**
   - Dimensions: `link_url`
   - Metric: `Event count`
   - Filter: Event name = `outbound_click`

---

## 🔄 How to Create Filters

### Step 1: Add Filter Control
1. Click **"Add a control"** → **"Drop-down list"**
2. Control field: Choose dimension (e.g., `Event name`, `Device category`)
3. Position at top of report

### Step 2: For Event-Specific Pages
Create **"Filter on a field"**:
1. Select chart → **Data** panel → **Filter** → **Add a filter**
2. Include: `Event name` → equals → `your_event_name`

---

## 📋 Creating Custom Calculated Fields

### Example: Engagement Rate by Event
1. Click **"Resource"** → **"Manage added data sources"**
2. Select your GA4 source → **Edit**
3. Click **"Add a field"**
4. Name: `Engagement Rate`
5. Formula: `Sessions with event / Sessions * 100`

---

## ✅ Final Checklist

- [ ] GA4 connected as data source
- [ ] Date range control added
- [ ] Overview dashboard created
- [ ] Navigation report created
- [ ] Blog engagement report created
- [ ] Project analytics report created
- [ ] Social media report created
- [ ] Certification report created
- [ ] Scroll depth report created
- [ ] Contact/conversion report created
- [ ] Filters and interactivity added
- [ ] Styling and branding applied
- [ ] Report shared with stakeholders