import paypal from 'paypal-rest-sdk'

paypal.configure({
    mode: "sandbox",
    client_id: "ATym6YVPddA7uqWdbeNhF4K26HKxuRuXpV6epNkaRdUDvMrf21LgYY9YgN5MVhHDmJknh32kvhExp-Mo",
    client_secret: "EE-zE-3qtTl4Fi6d-iVhIcDSl1luPB8Aunfn8xKt2TDoZTF9EDoCunAZuDgqvKv9qHUClvamywVpJYKW"
})

export default paypal