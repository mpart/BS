<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template name="replace-string">
    <xsl:param name="text"/>
    <xsl:param name="from"/>
    <xsl:param name="to"/>
    <xsl:choose>
      <xsl:when test="contains($text, $from)">
				<xsl:variable name="before" select="substring-before($text, $from)"/>
				<xsl:variable name="after" select="substring-after($text, $from)"/>
				<xsl:variable name="prefix" select="concat($before, $to)"/>
				<xsl:value-of select="$before"/>
				<xsl:value-of select="$to"/>
        <xsl:call-template name="replace-string">
		  		<xsl:with-param name="text" select="$after"/>
					<xsl:with-param name="from" select="$from"/>
		  		<xsl:with-param name="to" select="$to"/>
				</xsl:call-template>
      </xsl:when> 
      <xsl:otherwise>
        <xsl:value-of select="$text"/>  
      </xsl:otherwise>
    </xsl:choose>            
	</xsl:template>
 
<!-- define a lastIndexOf named template -->
	<xsl:template name="lastIndexOf">
	   <!-- declare that it takes two parameters - the string and the char -->
	   <xsl:param name="string" />
	   <xsl:param name="char" />
	   <xsl:choose>
	      <!-- if the string contains the character... -->
	      <xsl:when test="contains($string, $char)">
	         <!-- call the template recursively... -->
	         <xsl:call-template name="lastIndexOf">
	            <!-- with the string being the string after the character
	                 -->
	            <xsl:with-param name="string"
	                            select="substring-after($string, $char)" />
	            <!-- and the character being the same as before -->
	            <xsl:with-param name="char" select="$char" />
	         </xsl:call-template>
	      </xsl:when>
	      <!-- otherwise, return the value of the string -->
	      <xsl:otherwise><xsl:value-of select="$string" /></xsl:otherwise>
	   </xsl:choose>
	</xsl:template>


</xsl:stylesheet>
