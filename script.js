// Funzione principale per inizializzare il dynamic editor
function initializeDynamicEditor(schema, data) {
    const rootType = schema.find(s => s.IsRoot);
    if (rootType) {
        populateObjectList(rootType, data, schema, $('#object-list'));
    }
}

// Popola la lista degli oggetti sul pannello sinistro
function populateObjectList(typeSchema, dataObject, schema, container) {
    // Creiamo l'elemento radice
    const rootItem = $('<li class="object-item">').text(typeSchema.TypeName);
    container.append(rootItem);

    // Quando si clicca sul root, mostriamo le proprietà a destra
    rootItem.on('click', function () {
        showProperties(typeSchema, dataObject, schema, $('#property-fields'));
        $('.object-item').removeClass('selected');
        $(this).addClass('selected');
    });

    // Aggiungiamo eventuali oggetti all'interno come liste di oggetti
    typeSchema.Properties.forEach(property => {
        if (property.PropertyType.startsWith('List<')) {
            const listType = property.PropertyType.match(/^List<(.+)>$/)[1]; // Estrae il tipo dalla lista
            const listSchema = schema.find(s => s.TypeName === listType);

            if (listSchema && Array.isArray(dataObject[property.PropertyName])) {
                const listItems = dataObject[property.PropertyName];
                
                // Aggiunge ogni elemento della lista
                listItems.forEach((item, index) => {
                    const listItem = $('<li class="object-item">').text(`${listType} - ${item.Name || `Item ${index + 1}`}`);
                    container.append(listItem);
                    
                    // Click su ogni elemento della lista
                    listItem.on('click', function () {
                        showProperties(listSchema, item, schema, $('#property-fields'));
                        $('.object-item').removeClass('selected');
                        $(this).addClass('selected');
                    });
                });
            }
        }
    });
}

// Funzione per mostrare le proprietà di un oggetto nel pannello di destra
function showProperties(typeSchema, dataObject, schema, container) {
    container.empty(); // Puliamo il pannello di destra

    typeSchema.Properties.forEach(property => {
        const propertyName = property.PropertyName;
        const propertyType = property.PropertyType;
        const value = dataObject[propertyName] || '';
        
        let inputField;

        switch (propertyType) {
            case 'String':
                inputField = `<label>${propertyName}</label><input type="text" value="${value}" name="${propertyName}"/><br>`;
                break;
            case 'Int32':
                inputField = `<label>${propertyName}</label><input type="number" value="${value}" name="${propertyName}"/><br>`;
                break;
            case 'Boolean':
                const checked = value ? 'checked' : '';
                inputField = `<label>${propertyName}</label><input type="checkbox" ${checked} name="${propertyName}"/><br>`;
                break;
            // Possiamo aggiungere altri tipi come Enum, Date, ecc.
            default:
                break;
        }

        container.append(inputField);
    });
}
