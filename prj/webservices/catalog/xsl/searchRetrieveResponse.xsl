<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:srw="http://www.loc.gov/zing/srw/">

<xsl:import href="ber.xsl"/>
<xsl:import href="wsiface.xsl"/>
<xsl:include href="replace-string.xsl"/>
<!-- xsl:include href="url-decode.xsl"/-->

<xsl:variable name="title">External Data Source Web Service (through proxy)</xsl:variable>
<xsl:variable name="subtitle">SRU Search Result</xsl:variable>

<xsl:template match="/">
<xsl:call-template name="wsiface">
<xsl:with-param name="title" select="$title"/>
<xsl:with-param name="subtitle" select="$subtitle"/>
</xsl:call-template>
</xsl:template>

<xsl:template match="srw:searchRetrieveResponse">
<tr><td>
<xsl:apply-templates/>
</td></tr>
</xsl:template>

<xsl:template match="srw:records">
	<xsl:if test="../srw:echoedSearchRetrieveRequest">
		<tr><td>CQL Search:
			<xsl:value-of select="../srw:echoedSearchRetrieveRequest/srw:query"/>	
			<!-- xsl:call-template name="decode-query"><xsl:with-param name="query" select="../srw:echoedSearchRetrieveRequest/srw:query"/></xsl:call-template -->	
		</td></tr>
		<tr><td><xsl:call-template name="prev-nextRecord"/></td></tr>
		<xsl:apply-templates/>
		<tr><td><xsl:call-template name="prev-nextRecord"/></td></tr>	
	</xsl:if>
</xsl:template>

<xsl:template match="srw:record">
<tr><td>
    <xsl:apply-templates select="child::srw:recordData"/>
</td></tr>
</xsl:template>

<xsl:template match="srw:recordData">
  <table width="100%" cellpadding="3" cellspacing="3" style="border: 1px solid gray; background-color: #F7F7F7; margin-top: 1em;">

<xsl:choose>
<xsl:when test="../srw:recordPacking = 'string'">
<tr><td style="border: 1px solid">
<pre><xsl:value-of select="."/></pre>
</td></tr>
</xsl:when>
<xsl:otherwise>

	<xsl:for-each select="*">
		<xsl:for-each select="*">
			<xsl:variable name="atag" select="name(.)"/>
			<xsl:choose>
				<xsl:when test="contains($atag, 'leader')">
					<tr><td width="50" align="right">leader</td><td width="20"/><td width="20"/><td><xsl:value-of select="."/></td></tr>
				</xsl:when>		
				<xsl:when test="contains($atag, 'control')">
					<tr><td width="50" align="right"><xsl:value-of select="@tag"/></td><td width="20"/><td width="20"/><td><xsl:value-of select="."/></td></tr>
				</xsl:when>
				<xsl:when test="contains($atag, 'datafield')">
					<tr valign="top"><td width="50" align="right"><xsl:value-of select="@tag"/></td><td width="20"><xsl:value-of select="@ind1"/></td><td width="20"><xsl:value-of select="@ind2"/></td>		
					<td>
					<xsl:for-each select="*">
						<xsl:text> $</xsl:text><xsl:value-of select="@code"/> <xsl:value-of select="."/>
					</xsl:for-each>
					</td></tr>
				</xsl:when>
				<xsl:when test="starts-with($atag,'dc')">
					<tr valign="top"><td align="right" width="100"><xsl:value-of select="name(.)"/></td><td/><td/><td><xsl:value-of select="."/></td></tr>
				</xsl:when>
				<xsl:when test="starts-with($atag,'iso')">
					<xsl:for-each select="*">
						<tr valign="top"><td align="right" width="50">holding</td><td/><td/><td><xsl:value-of select="."/></td></tr>
					</xsl:for-each>
				</xsl:when>
				<xsl:otherwise>
						<tr valign="top"><td align="right" width="50"><xsl:value-of select="$atag"/></td><td/><td/><td><xsl:value-of select="."/></td></tr>			
				</xsl:otherwise>		
			</xsl:choose>
	
		</xsl:for-each>
	</xsl:for-each>
	
</xsl:otherwise>
</xsl:choose>

</table>
</xsl:template>


<xsl:template match="srw:echoedSearchRetrieveRequest"/>
<xsl:template match="srw:extraResponseData"/>


<xsl:template name="prev-nextRecord">
  <xsl:variable name="startRecord" select="number(/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:startRecord)"/>
  <xsl:variable name="maximumRecords">
    <xsl:value-of select="number(/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:maximumRecords)"/>
    </xsl:variable>
  <xsl:variable name="prev" select="$startRecord - $maximumRecords"/>
  <xsl:variable name="recordSchema">
	<xsl:if test="/srw:searchRetrieveResponse/srw:records/srw:record/srw:recordSchema">&amp;recordSchema=<xsl:value-of select="/srw:searchRetrieveResponse/srw:records/srw:record/srw:recordSchema"/></xsl:if>
  </xsl:variable>
  <xsl:variable name="resultSetId">
	<xsl:value-of select="/srw:searchRetrieveResponse/srw:resultSetId"/>
  </xsl:variable>
  <xsl:variable name="sortKeys">
	<xsl:value-of select="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:sortKeys"/>
  </xsl:variable>
  <xsl:variable name="wskey">
  	<xsl:value-of select="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:wskey"/>
  </xsl:variable>  
	<xsl:variable name="frbr">
  	<xsl:if test="string-length(/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:x-info-5-frbrGrouping) &gt; 0"><xsl:text>&amp;x-info-5-frbrGrouping=</xsl:text><xsl:value-of select="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:x-info-5-frbrGrouping"/></xsl:if>
  </xsl:variable>
	<xsl:variable name="servicelevel">
  	<xsl:if test="string-length(/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:servicelevel) &gt; 0"><xsl:text>&amp;servicelevel=</xsl:text><xsl:value-of select="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:servicelevel"/></xsl:if>
  </xsl:variable>  

	<xsl:if test="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest">
		<xsl:variable name="thequery">
			<xsl:call-template name="replace-string">
				<xsl:with-param name="text" select="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:query"/>
				<xsl:with-param name="from" select="'='"/>
				<xsl:with-param name="to" select="'%3D'"/>	
			</xsl:call-template>
		</xsl:variable>
	<xsl:choose>
	  <xsl:when test="$prev&gt;0">
	   <a><xsl:attribute name="href">?operation=searchRetrieve&amp;startRecord=<xsl:value-of select="$prev"/>&amp;maximumRecords=<xsl:value-of select="$maximumRecords"/><xsl:value-of select="$recordSchema"/>&amp;recordPacking=<xsl:value-of select="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:recordPacking"/>&amp;query=<xsl:value-of select="$thequery"/>&amp;sortKeys=<xsl:value-of select="$sortKeys"/>&amp;wskey=<xsl:value-of select="$wskey"/><xsl:value-of select="$frbr"/><xsl:value-of select="$servicelevel"/></xsl:attribute>&lt; Previous </a>
	  </xsl:when>
	  <xsl:otherwise>
	   &lt; Previous
	  </xsl:otherwise>
  </xsl:choose>
	<xsl:text> | </xsl:text>
	Records <xsl:value-of select="$startRecord"/>
	<xsl:text> to </xsl:text>
	<xsl:choose>
		<xsl:when test="/srw:searchRetrieveResponse/srw:nextRecordPosition != ''">
			<xsl:value-of select="/srw:searchRetrieveResponse/srw:nextRecordPosition - 1"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="/srw:searchRetrieveResponse/srw:numberOfRecords"/>
		</xsl:otherwise>
	</xsl:choose>
	<xsl:text> of </xsl:text><xsl:value-of select="/srw:searchRetrieveResponse/srw:numberOfRecords"/>
	<xsl:text> | </xsl:text>
	<xsl:choose>
  	<xsl:when test="/srw:searchRetrieveResponse/srw:nextRecordPosition">
  		<a><xsl:attribute name="href">?operation=searchRetrieve&amp;startRecord=<xsl:value-of select="/srw:searchRetrieveResponse/srw:nextRecordPosition"/>&amp;maximumRecords=<xsl:value-of select="$maximumRecords"/><xsl:value-of select="$recordSchema"/>&amp;recordPacking=<xsl:value-of select="/srw:searchRetrieveResponse/srw:echoedSearchRetrieveRequest/srw:recordPacking"/>&amp;query=<xsl:value-of select="$thequery"/>&amp;sortKeys=<xsl:value-of select="$sortKeys"/>&amp;wskey=<xsl:value-of select="$wskey"/><xsl:value-of select="$frbr"/><xsl:value-of select="$servicelevel"/></xsl:attribute>Next &gt;</a>
  	</xsl:when>
  	<xsl:otherwise>
  	Next &gt;
  	</xsl:otherwise>
  </xsl:choose>
	</xsl:if>

</xsl:template>

</xsl:stylesheet>