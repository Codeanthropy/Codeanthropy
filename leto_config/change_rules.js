var foundAt = -1;


exports.insertAfterFinding = function( lineNumber, text, stringToFind, numLinesAfter, lineToInsert ) {
	if( foundAt == -1 && text.indexOf(stringToFind) != -1 )
		foundAt = lineNumber;

	if( foundAt != -1 && lineNumber == foundAt + numLinesAfter ) {
		foundAt = -1;
		text = lineToInsert + "\n" + text;
	}

	return text;
}