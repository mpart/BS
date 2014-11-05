<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:srw="http://www.loc.gov/zing/srw/"
  xmlns:diag="http://www.loc.gov/zing/srw/diagnostic/">

<xsl:output method="html" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>

<xsl:template name="wsiface">
<html>
<head>
<title><xsl:value-of select="$title"/>: <xsl:value-of select="$subtitle"/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link href="http://worldcat.org/css/worldcat_screen.css" rel="stylesheet" type="text/css"/>
<style type="text/css">
&lt;!--
table.layout { border: none; margin: 0; padding: 0; width: 100%; }
table.layout td { border: none; margin: 0; padding: 0; }
table.formtable th, table.formtable td { border: 1px solid #999; color: #333; padding: 4px; text-align: left; vertical-align: top}
table.formtable td { width: 100%}
input.button { margin: 0; }
#crumbs {
	font-size: xx-small;
	voice-family: "\"}\"";
	voice-family: inherit;
	font-size: x-small;
	margin-bottom: 15px;
}
.subtitle { font-size: 150%; color: #666666; }
--&gt;
</style>
</head>
<body style="padding: 1em;">

<table cellspacing="0">
<tr>
<td class="image"><img src="http://www.metropolia.fi/fileadmin/template/images/tunnus.gif" alt="" width="79" height="79" /></td>
<td class="content">
<a href="/webservices/catalog"><h1 class="headline"><xsl:value-of select="$title"/></h1></a>
<div class="subtitle"><xsl:value-of select="$subtitle"/></div>
</td>
</tr>
</table>

<table cellspacing="0">
<xsl:apply-templates/>
</table>

</body>
</html>

</xsl:template>

<xsl:template match="srw:version">
</xsl:template>

<xsl:template match="srw:diagnostics">
<tr><td><h2>Diagnostics</h2></td></tr>
<tr><td width="50%" style="padding-right: 10px;">
<xsl:apply-templates/>
</td><td></td></tr>
</xsl:template>

<xsl:template match="diag:diagnostic">
<table cellspacing="0" class="formtable">
<xsl:apply-templates/>
</table>
</xsl:template>

<xsl:template match="diag:uri">
<tr><th>Identifier:</th><td><xsl:value-of select="."/></td></tr>
<tr><th>Meaning:</th>
<xsl:variable name="diag" select="."/>
<td>
<xsl:choose>
  <xsl:when test="$diag='info:srw/diagnostic/1/1'">
    <xsl:text>General System Error</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/6'">
    <xsl:text>Unsupported Parameter Value</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/7'">
    <xsl:text>Mandatory Parameter Not Supplied</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/10'">
    <xsl:text>Query Syntax Error</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/16'">
    <xsl:text>Unsupported Index</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/22'">
    <xsl:text>Unsupported Combination of Relation and Index</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/51'">
    <xsl:text>Result Set Does Not Exist</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/61'">
    <xsl:text>First Record Position Out Of Range</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/66'">
    <xsl:text>Unknown Schema For Retrieval</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/71'">
    <xsl:text>Unsupported record packing</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/93'">
    <xsl:text>Sort Ended Due To Missing Value</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/94'">
    <xsl:text>When resultSetTTL=0, Sort Only Legal When startRec=1</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/110'">
    <xsl:text>Stylesheets Not Supported</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/120'">
    <xsl:text>Response Position Out Of Range</xsl:text>
    </xsl:when>
  <xsl:when test="$diag='info:srw/diagnostic/1/130'">
    <xsl:text>Too Many Terms Matched By Masked Query Term</xsl:text>
    </xsl:when>
  </xsl:choose>
</td>
</tr>
</xsl:template>

<xsl:template match="diag:details">
<tr><th>Details:</th><td><xsl:value-of select="."/></td></tr>
</xsl:template>

<xsl:template match="diag:message"><tr><td><b>Message:</b></td><td><xsl:value-of select="."/></td></tr></xsl:template>

</xsl:stylesheet>
