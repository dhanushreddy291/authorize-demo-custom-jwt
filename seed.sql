insert into tenants values 
    ('f330c503-5e9c-46a7-8393-2995aeb03675', 'Neon'),
    ('e3e0bc31-2df8-4410-9b5d-ff71cf509a8e', 'Other Company');

insert into users ("tenantId", id, name, email) values
    ('f330c503-5e9c-46a7-8393-2995aeb03675', '2e7e25e8-5445-40bd-8f89-dc19bba64faa', 'David', 'david@neon.tech'),
    ('e3e0bc31-2df8-4410-9b5d-ff71cf509a8e', '78a78d6d-0ed0-401c-8322-7885cd1c92ab', 'Other Employee', 'other@other.com');

GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public to authenticated;