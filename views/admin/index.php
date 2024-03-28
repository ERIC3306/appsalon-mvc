<h1 class="nombre-pagina">Panel de Administración</h1>

<?php 
    include_once __DIR__ . '/../templates/barra.php';
?>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input 
                type="date"
                id="fecha"
                name="fecha"
                value="<?php echo $fecha; ?>"
            />
        </div>
    </form> 
</div>

<?php
    if(count($citas) === 0) {
        echo "<h2>No Hay Citas en esta fecha</h2>";
    }
?>

<div id="citas-admin">
    <ul class="citas">   
            <?php 
                $idCita = 0;
                foreach( $citas as $key => $cita ) {
   
                    if($idCita !== $cita->id) {     //Si idCita es diferente al id de la cita entonces imprime los datos
                        $total = 0;
            ?>
            <li>
                    <p>ID: <span><?php echo $cita->id; ?></span></p>
                    <p>Hora: <span><?php echo $cita->hora; ?></span></p>
                    <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
                    <p>Email: <span><?php echo $cita->email; ?></span></p>
                    <p>Email: <span><?php echo $cita->telefono; ?></span></p>

                    <h3>Servicios</h3>
            <?php 
                $idCita = $cita->id;                //despues de imprimir las citas se coloca esta igualdad para ya no imprimira otra vez
            } // Fin de IF 
                $total += $cita->precio;                //Sumatoria de los precios de los servicios de cada cita
            ?>
                    <p class="servicio"><?php echo $cita->servicio . " " . $cita->precio; ?></p>
            
            <?php 
                $actual = $cita->id;                    //Nos retorna el id en el cual nos encontramos
                $proximo = $citas[$key + 1]->id ?? 0;   //Es el indice en el arrglo de la BD, para identificar cual es el ultimo registro(cita) que tiene el mismo id

                if(esUltimo($actual, $proximo)) { ?>        <!-- Si el id actual es diferente al proximo id retorna true, si es true imprime el total a pagar -->
                                                            <!-- Si es False, significa que hace referencia a la misma cita -->
                    <p class="total">Total: <span>$ <?php echo $total; ?></span></p>

                    <form action="/api/eliminar" method="POST">
                        <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                        <input type="submit" class="boton-eliminar" value="Eliminar">
                    </form>

            <?php } 
          } // Fin de Foreach ?>
     </ul>
</div>

<?php
    $script = "<script src='build/js/buscador.js'></script>"
?>