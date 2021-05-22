# Use official nginx image as the base image
FROM nginx
# Set the working directory
WORKDIR /usr/share/nginx/html
# Copy the build output to replace the default nginx contents.
COPY dist/Best-Playz-Frontend .
# when the docker starts it should contain an entrypoint and instruct linux to allow it to be executable
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
