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


### Frontend

1. Navegue até o diretório `frontend` (ou o diretório onde está o projeto React):
    ```sh
    cd frontend
    ```
    _Obs: ajuste este caminho caso o frontend esteja em outra pasta._

2. Instale as dependências:
    ```sh
    npm install
    ```
    ou, se preferir usar yarn:
    ```sh
    yarn
    ```

3. Inicie o servidor de desenvolvimento:
    ```sh
    npm start
    ```
    ou com yarn:
    ```sh
    yarn start
    ```

4. O sistema estará disponível em:  
    ```
    http://localhost:3000
    ```

5. Para gerar uma versão de produção otimizada:
    ```sh
    npm run build
    ```
    ou
    ```sh
    yarn build
    ```
