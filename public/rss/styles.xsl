<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1rem;
            background: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
          }
          .header h1 {
            margin: 0 0 0.5rem 0;
            font-size: 1.75rem;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
          }
          .info-box {
            background: #e7f3ff;
            border-left: 4px solid #0366d6;
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 0 8px 8px 0;
          }
          .info-box a {
            color: #0366d6;
          }
          .items {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .item {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: box-shadow 0.2s ease;
          }
          .item:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .item-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
          }
          .item-title a {
            color: #333;
            text-decoration: none;
          }
          .item-title a:hover {
            color: #667eea;
          }
          .item-date {
            color: #666;
            font-size: 0.875rem;
            margin-bottom: 0.75rem;
          }
          .item-description {
            color: #555;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📡 <xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
        </div>
        <div class="info-box">
          <strong>This is an RSS feed.</strong> Subscribe by copying the URL from the address bar into your RSS reader. 
          <a href="https://aboutfeeds.com" target="_blank">Learn more about RSS</a>.
        </div>
        <ul class="items">
          <xsl:for-each select="/rss/channel/item">
            <li class="item">
              <h2 class="item-title">
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="item-date">
                <xsl:value-of select="pubDate"/>
              </p>
              <p class="item-description">
                <xsl:value-of select="description"/>
              </p>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
