/*
 * This code exists for the purposes of creating a javascript structure to include code fragments for
 * handoff to PA.
 * This is not intended for and should NEVER be used on a live website.
 */
function includeFragment(path) {
  var filePath = path,
  xmlhttp = new XMLHttpRequest(),
  fc;
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send( null );
  fc = xmlhttp.responseText;
  document.write(fc);
}