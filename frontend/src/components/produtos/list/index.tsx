import React, { useState, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';  
import { TableStyles } from '../../tableStyles';
import { useNavigate } from 'react-router-dom';
import { RemoveModal } from '../../removeModal';
import { ProductDTO } from '../../../types';
import { productService } from '../../../services/productService';
import 'react-datepicker/dist/react-datepicker.css';
import { notifyError } from '../../../utils/errorUtils';

export const ListProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const navigate = useNavigate();

  const [filterName, setFilterName] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.listAll();
      setProducts(data);
    } catch (err) {
      setError('Erro ao carregar produtos.');
      notifyError(err, 'Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsFiltered = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fallback: filtra no frontend para evitar erro 400 em /products/filter no backend
      const all = await productService.listAll();
      const nameTerm = (filterName || '').toLowerCase().trim();
      const filtered = all.filter(p => {
        const matchName = !nameTerm || p.name.toLowerCase().includes(nameTerm);
        return matchName;
      });
      setProducts(filtered);
    } catch (err) {
      setError('Erro ao carregar produtos filtrados.');
      notifyError(err, 'Erro ao carregar produtos filtrados.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToNewProduct = () => {
    navigate('/products/new');
  };

  const navigateToEditProduct = (product: ProductDTO) => {
    navigate(`/products/edit/${product.id}`);
  };

  const openRemoveModal = (product: ProductDTO) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const confirmRemove = async () => {
    if (selectedProduct) {
      try {
        await productService.delete(selectedProduct.id);
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setModalOpen(false);
      } catch (err) {
        setError('Erro ao remover produto.');
        notifyError(err, 'Erro ao remover produto.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      fetchProductsFiltered();
    }
  };

  const filtros = (
    <div className="filtros">
      <input
        type="text"
        placeholder="Filtrar por nome"
        value={filterName}
        onChange={e => setFilterName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="btn-submit" type="button" onClick={fetchProductsFiltered}>
        Filtrar
      </button>
      <button
        className="btn-cancel"
        type="button"
        onClick={() => {
          setFilterName('');
          fetchProducts();
        }}
      >
        Limpar
      </button>
    </div>
  );

  return (
    <StandardPage
      title="Produtos"
      buttonLabel="Novo produto"
      onButtonClick={navigateToNewProduct}
      filters={filtros}
    >
      <TableStyles>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th className="action-cell">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>Carregando produtos...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} style={{ color: 'red' }}>{error}</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4}>Nenhum produto encontrado.</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.type}</td>
                  <td>{product.description}</td>
                  <td className="action-cell">
                    <button
                      className="action-button"
                      onClick={() => navigateToEditProduct(product)}
                    >
                      <img src="/IconEdit.png" alt="Editar" />
                    </button>
                    <button
                      className="action-button"
                      onClick={() => openRemoveModal(product)}
                    >
                      <img src="/IconLixo.png" alt="Excluir" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableStyles>

      <RemoveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmRemove}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir o produto "${selectedProduct?.name}"?`}
      />
    </StandardPage>
  );
};
