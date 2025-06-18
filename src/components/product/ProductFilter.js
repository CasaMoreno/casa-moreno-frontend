import styled from 'styled-components';

const FilterContainer = styled.aside`
  flex: 1;
  margin-right: 2rem;
  padding-right: 2rem;
  border-right: 1px solid #ddd;
  align-self: flex-start;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    margin-bottom: 0.5rem;
  }
`;

const ProductFilter = ({ brands }) => {
    return (
        <FilterContainer>
            <h3>Filtros</h3>
            <FilterGroup>
                <h4>Marca</h4>
                {brands.map(brand => (
                    <div key={brand}>
                        <input type="checkbox" id={brand} name={brand} />
                        <label htmlFor={brand}> {brand}</label>
                    </div>
                ))}
            </FilterGroup>
        </FilterContainer>
    );
}

export default ProductFilter;