## 4. Google Tag Manager Configuration

### Step 1: Create Variables in GTM

Go to **GTM → Variables → User-Defined Variables** and create:

| Variable Name | Variable Type | Data Layer Variable Name |
|---------------|---------------|-------------------------|
| `DLV - Event Name` | Data Layer Variable | `event` |
| `DLV - Link Text` | Data Layer Variable | `link_text` |
| `DLV - Link URL` | Data Layer Variable | `link_url` |
| `DLV - Post Title` | Data Layer Variable | `post_title` |
| `DLV - Post Slug` | Data Layer Variable | `post_slug` |
| `DLV - Platform` | Data Layer Variable | `platform` |
| `DLV - Scroll Percent` | Data Layer Variable | `percent` |
| `DLV - Duration Seconds` | Data Layer Variable | `duration_seconds` |
| `DLV - Cert Title` | Data Layer Variable | `cert_title` |
| `DLV - Issuer` | Data Layer Variable | `issuer` |

### Step 2: Create Triggers in GTM

Go to **GTM → Triggers** and create:

#### Trigger: Navigation Click
- **Type:** Custom Event
- **Event name:** `nav_click`
- **Fires on:** All Custom Events

#### Trigger: Footer Click
- **Type:** Custom Event
- **Event name:** `footer_click`
- **Fires on:** All Custom Events

#### Trigger: Social Click
- **Type:** Custom Event
- **Event name:** `social_click`
- **Fires on:** All Custom Events

#### Trigger: Blog Post Click
- **Type:** Custom Event
- **Event name:** `blog_post_click`
- **Fires on:** All Custom Events

#### Trigger: Project Click
- **Type:** Custom Event
- **Event name:** `project_click`
- **Fires on:** All Custom Events

#### Trigger: Certification Credential Click
- **Type:** Custom Event
- **Event name:** `certification_credential_click`
- **Fires on:** All Custom Events

#### Trigger: Contact Email Click
- **Type:** Custom Event
- **Event name:** `contact_email_click`
- **Fires on:** All Custom Events

#### Trigger: Scroll Depth
- **Type:** Custom Event
- **Event name:** `scroll_depth`
- **Fires on:** All Custom Events

#### Trigger: Outbound Click
- **Type:** Custom Event
- **Event name:** `outbound_click`
- **Fires on:** All Custom Events

### Step 3: Create Tags in GTM

Go to **GTM → Tags** and create:

#### Tag: GA4 - Navigation Click
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Configuration Tag]
Event Name: nav_click
Event Parameters:
  - link_text: {{DLV - Link Text}}
  - link_url: {{DLV - Link URL}}
Trigger: Navigation Click
```

#### Tag: GA4 - Social Click
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Configuration Tag]
Event Name: social_click
Event Parameters:
  - platform: {{DLV - Platform}}
  - link_url: {{DLV - Link URL}}
Trigger: Social Click
```

#### Tag: GA4 - Blog Post Click
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Configuration Tag]
Event Name: blog_post_click
Event Parameters:
  - post_title: {{DLV - Post Title}}
  - post_slug: {{DLV - Post Slug}}
Trigger: Blog Post Click
```

#### Tag: GA4 - Project Click
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Configuration Tag]
Event Name: project_click
Event Parameters:
  - project_title: {{DLV - Post Title}}
  - project_slug: {{DLV - Post Slug}}
Trigger: Project Click
```

#### Tag: GA4 - Certification Credential Click
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Configuration Tag]
Event Name: certification_credential_click
Event Parameters:
  - cert_title: {{DLV - Cert Title}}
  - issuer: {{DLV - Issuer}}
  - credential_url: {{DLV - Link URL}}
Trigger: Certification Credential Click
```

#### Tag: GA4 - Contact Email Click
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Configuration Tag]
Event Name: contact_email_click
Event Parameters:
  - email: me@vedgupta.in
Trigger: Contact Email Click
```

#### Tag: GA4 - Scroll Depth
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Configuration Tag]
Event Name: scroll_depth
Event Parameters:
  - percent: {{DLV - Scroll Percent}}
  - page_path: {{Page Path}}
Trigger: Scroll Depth
```

---

### Custom Definitions

| Name | Description | Scope | Parameter |
|------|-------------|-------|-----------|
| Certification Title | - | Event | `cert_title` |
| Issuer | - | Event | `issuer` |
| Link Text | - | Event | `link_text` |
| Link Url | - | Event | `link_url` |
| Platform | - | Event | `platform` |
| Post Slug | - | Event | `post_slug` |
| Post Title | - | Event | `post_title` |
| Project Slug | - | Event | `project_slug` |
| Project Title | - | Event | `project_title` |
| Scroll Depth Percent | Percentage of page scrolled | Event | `percent` |