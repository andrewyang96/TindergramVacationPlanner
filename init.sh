printf "Starting setup script"

cockroach sql < setup.sql
printf "Finished initial database setup"

read -p "Enter Facebook client ID: " fb_client_id
read -p "Enter Facebook client secret: " fb_client_secret

cockroach sql <<< "INSERT INTO tgvp.credentials VALUES ('fb', '$fb_client_id', '$fb_client_secret')"
printf "Entered credentials"

cockroach sql < cities.sql
printf "Inserted cities"
