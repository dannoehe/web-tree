const splitLines = str => str.split(/\r?\n/);

function parseTree(data) { 
    console.log( data );
    console.log( splitLines(data) );
    
    return splitLines(data); 
 } 