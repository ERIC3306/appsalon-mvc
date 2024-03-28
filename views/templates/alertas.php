<?php
    foreach($alertas as $key => $mensajes):     //Itera sobre el arreglo principal
        foreach($mensajes as $mensaje):         //Itera sobre los mensajes(arreglo) del arreglo principal
?>
    <div class="alerta <?php echo $key; ?>">
        <?php echo $mensaje; ?>
    </div>
<?php
        endforeach;
    endforeach;
?>