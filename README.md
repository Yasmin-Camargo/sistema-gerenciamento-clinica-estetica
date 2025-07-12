# sistema-gerenciamento-clinica-estetica 💻💄💅🏼
Sistema desenvolvido durante a disciplina de Desenvolvimento de Softwares, com o objetivo de gerenciar atendimentos em clínicas de estética.

## 🛠️ Como Executar
### Backend

1. Navegue até o diretório `backend`:
    ```sh
    cd backend/BeautyClinicSystem
    ```

2. Inicie o banco de dados PostgreSQL usando Docker:
    ```sh
    docker-compose up -d
    ```

3. Execute a aplicação Spring Boot:
    ```sh
    ./mvnw spring-boot:run
    ```

### Resetar banco de dados
1. Navegue até o diretório `backend`:
    ```sh
    cd backend/BeautyClinicSystem
    ```

2. Execute o script:
    ```sh
    ./tools/reset-db.sh
    ```
