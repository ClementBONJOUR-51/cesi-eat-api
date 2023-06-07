//Model address

const Address = function(address) {
    this.postal_code = address.postal_code;
    this.street = address.street;
    this.city = address.city;
    this.street_number = address.street_number;
    this.lati = address.lati;
    this.longi = address.longi;
    this.date_in = address.date_in;
    this.date_out = address.date_out;
}