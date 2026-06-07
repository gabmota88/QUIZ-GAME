export default function CategoriasDebug({
  categorias
}) {

  return (

    <div>

      {categorias.map(cat => (

        <div key={cat.id}>
          {cat.nome}
        </div>

      ))}

    </div>

  );

}