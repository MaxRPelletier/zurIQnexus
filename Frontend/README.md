# Finance Assistant Dashboard

A modern, voice-assisted financial dashboard web application built with **HTML**, **CSS**, **JavaScript**, **Nginx**, and **Docker**.  
It features a detailed overview of banking assets, dynamic voice-driven navigation for Raiffeisen bank products, and a secure deployment using HTTPS via self-signed certificates.

---

## Project Structure

- **Frontend**:  
  A responsive dashboard displaying accounts, investments, and pension plans. Speech recognition allows users to interact with Raiffeisen bank products and receive AI-based suggestions.

- **Backend**:  
  Served using an **Nginx** container with HTTPS enabled, managed by Docker Compose.

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### Running the Project

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>
   ```

2. **Set up SSL certificates**:
   - Place your SSL certificate and key in a `certs/` folder at the project root:
     - `certs/selfsigned.crt`
     - `certs/selfsigned.key`
   - *(For local development, you can generate self-signed certificates using OpenSSL.)*

3. **Start the application**:
   ```bash
   docker-compose up -d
   ```

4. **Access the dashboard**:
   - Open [https://localhost](https://localhost) (accept browser's SSL warning).

---

## File Overview

| File                   | Description                                                 |
|:------------------------|:------------------------------------------------------------|
| `docker-compose.yml`    | Defines and runs the Nginx container with volume mappings    |
| `nginx.conf`            | Configures HTTP to HTTPS redirection and static file serving |
| `html/index.html`       | Main frontend dashboard                                      |
| `html/styles.css`       | CSS styles for the dashboard                                 |
| `html/script.js`        | Handles dynamic interaction, speech recognition, AI calls    |

> **Note**: The project expects a `raiffeisenprodukte_nested_structured.json` file for dynamic subjects.

---

## Features

- 📊 Interactive charts (bar and pie) with **Chart.js**
- 🎤 Voice recognition using browser's **Web Speech API**
- 💬 AI-generated short descriptions for Raiffeisen products (via OpenAI)
- 🔒 HTTPS with self-signed certificates
- 🐳 Simple containerized deployment using **Docker Compose**

---

## Security Considerations

- **API Key Exposure**:  
  The OpenAI API key is hardcoded in `script.js`. **Do not use this approach in production!**  
  Instead, set up a backend server to securely handle OpenAI API requests.

- **SSL**:  
  The project uses self-signed certificates. For production, use trusted certificates (e.g., [Let's Encrypt](https://letsencrypt.org/)).

---

## Future Improvements

- Add a secure backend to manage OpenAI API securely
- Enhance mobile responsiveness
- Expand voice command support
- Implement authentication (login/logout functionality)

---

## License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute it.

---

## Acknowledgements

- [Nginx](https://www.nginx.com/)
- [Docker](https://www.docker.com/)
- [Chart.js](https://www.chartjs.org/)
- [OpenAI API](https://platform.openai.com/)

---
