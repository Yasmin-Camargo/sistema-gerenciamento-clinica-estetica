import React, { useState, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { ProductDTO } from '../../../types';

export const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ProductDTO>({
    id: 0,
    name: '',
    type: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const product = await productService.findById(Number(id));
        setFormData(product);
      } catch (error) {
        alert('Erro ao carregar dados do produto.');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.update(formData.id, formData);
      alert('Produto atualizado com sucesso!');
      navigate('/products');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return (
      <StandardPage title="Editar Produto">
        <p>Carregando dados...</p>
      </StandardPage>
    );
  }

  return (
    <StandardPage title="Editar Produto">
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome do produto"
            required
          />
        </div>

        <div className="field">
          <label>Tipo*</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Tipo do produto"
            required
          />
        </div>

        <div className="field">
          <label>Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição do produto"
          />
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
  );
};
