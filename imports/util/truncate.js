function truncate(string, length) {
  String.prototype.trunc = String.prototype.trunc ||
        function(n){
            return (this.length > n) ? this.substr(0,n-1) : this;
        };

  if(typeof string!=="string") {
    string = string.toString();
  }

  return string.trunc(length);
}

export default truncate;
