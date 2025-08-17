import React, { useState } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';

export interface ProcedureFormData {
  name: string;
  description: string;
  estimatedDuration: number;
  cost: number;
  productIds: number[];
}

interface ProductOption {
  id: number;
  name: string;
  cost: number;
}

export const NewProcedurePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProcedureFormData>({
    name: '',
    description: '',
    estimatedDuration: 0,
    cost: 0,
    productIds: []
  });

  const [products, setProducts] = useState<ProductOption[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const data = Array.isArray(response.data) ? response.data : [];
        const normalized: ProductOption[] = data
          .filter((p: any) => p && (p.id !== undefined || p.ID !== undefined))
          .map((p: any) => ({
            id: Number(p.id ?? p.ID),
            name: String(p.name ?? ''),
            cost: Number(p.cost ?? 0)
          }));
        setProducts(normalized);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDuration' || name === 'cost' ? Number(value) : value
    }));
  };

  const handleProductsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(option => Number(option.value));
    setFormData(prev => ({ ...prev, productIds: selectedIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productRefs = formData.productIds
        .map(id => {
          const found = products.find(p => p.id === id);
          return found ? { id: found.id, name: found.name } : undefined;
        })
        .filter((x): x is { id: number; name: string } => Boolean(x));

      const payload = {
        name: formData.name,
        description: formData.description,
        estimatedDuration: formData.estimatedDuration,
        cost: formData.cost,
        products: productRefs
      };

      const response = await api.post('/procedures', payload);
      console.log('Procedimento criado com sucesso:', response.data);
      alert('Procedimento cadastrado com sucesso!');
      navigate('/procedure');
    } catch (error: any) {
      console.error('Erro ao cadastrar procedimento:', error);
      alert('Erro ao cadastrar procedimento. Verifique os dados e tente novamente.');
    }
  };

  return (
    <StandardPage
      title="Novo Procedimento"
>
  <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Nome*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome do procedimento"
          required
        />
      </div>

      <div className="field">
        <label>Descrição*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição do procedimento"
          required
        />
      </div>

      <div className="field">
        <label>Duração Estimada (minutos)*</label>
        <input
          type="number"
          name="estimatedDuration"
          value={formData.estimatedDuration}
          onChange={handleChange}
          placeholder="Duração em minutos"
          required
        />
      </div>

      <div className="field">
        <label>Custo (R$)*</label>
        <input
          type="number"
          step="0.01"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          placeholder="Custo do procedimento"
          required
        />
      </div>

      <div className="field">
        <label>Produtos</label>
        <select
          name="productIds"
          multiple
          value={formData.productIds.map(String)}
          onChange={handleProductsChange}
          style={{ minHeight: '100px' }}
        >
          {products.length === 0 ? (
            <option disabled>Nenhum produto encontrado</option>
          ) : (
            products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - R$ {Number(product.cost).toFixed(2).replace('.', ',')}
              </option>
            ))
          )}
        </select>
        <small>Mantenha Ctrl pressionado para selecionar múltiplos produtos</small>
      </div>

         <div className="actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Salvar
          </button>
        </div>
      </form>
    </StandardPage>
  )
}