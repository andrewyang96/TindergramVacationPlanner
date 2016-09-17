printf "Starting setup script\n"

cockroach sql < setup.sql
printf "Finished initial database setup\n"

read -p "Enter Facebook client ID: " fb_client_id
read -p "Enter Facebook client secret: " fb_client_secret

cockroach sql <<< "INSERT INTO tgvp.credentials VALUES ('fb', '$fb_client_id', '$fb_client_secret');"
printf "Entered credentials\n"

cockroach sql < cities.sql
printf "Inserted cities\n"
