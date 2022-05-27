const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { ServerSideRender } = wp.editor;
const { TextControl, ToggleControl, PanelBody, PanelRow, CheckboxControl, SelectControl, Toolbar, ToolbarButton, Placeholder, Disabled } = wp.components;
const { withSelect, select } = wp.data;
 
class PostTypeListBlockEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode:true
        }
    }

    getInspectorControls = () => {
        const { attributes, setAttributes } = this.props;
        let taxchoices = [];
        if (this.props.typesList) {
            const chosenposttype = this.props.typesList.find(el => el.slug == attributes.selectedPostType);
            taxchoices.push({ value: "0", label: 'Select a Post Type' });
            chosenposttype.taxonomies.forEach(taxonomy => {
                taxchoices.push({ value: taxonomy, label: taxonomy });
            });
        } else {
            taxchoices.push({ value: "0", label: 'Loading...' })
        }
        return (
        <InspectorControls>
            <PanelBody
                title="Link Information"
                initialOpen={true}
            >
                <PanelRow>
                    <SelectControl
                            label='Link to:'
                            options={[{ value: "postpage", label: 'Post Page' },
                                    { value: "file", label: 'File Download' }]}
                            value={attributes.linkLocation}
                            onChange={(newval) => setAttributes({ linkLocation: newval })}
                            />
                </PanelRow>
                {attributes.linkLocation === "file" && 
                <PanelRow>
                    <TextControl
                        label='Field Name'
                        value={attributes.fieldName}
                        onChange={(newtext) => setAttributes({fieldName: newtext})} />
                </PanelRow>
                }
                
            </PanelBody>
            <PanelBody
                title="Post Order"
                initialOpen={false}
            >
                <PanelRow>
                    <SelectControl
                            label='Order Posts:'
                            options={[{ value: "title", label: 'Alphabetically' },
                                    { value: "date", label: 'By Date (Newest First)' },
                                    { value: "taxterms", label: 'By Taxonomy Terms' }]}
                            value={attributes.orderTerms}
                            onChange={(newval) => setAttributes({ orderTerms: newval })}
                            />
                </PanelRow>
                {attributes.orderTerms === "taxterms" && 
                    <PanelRow>
                        <SelectControl
                                label='Select Taxonomy'
                                options={taxchoices}
                                value={attributes.TaxonomyOrder}
                                onChange={(newval) => setAttributes({ TaxonomyOrder: newval })}
                                />
                    </PanelRow>
                }
                {attributes.orderTerms === "taxterms" && 
                    <PanelRow>
                        <TextControl
                            label='Exclude Taxonomy Terms'
                            value={attributes.excludedTaxonomies}
                            onChange={(newtext) => setAttributes({excludedTaxonomies: newtext})} />
                    </PanelRow>
                }
                <PanelRow>
                    <TextControl
                        label='True/False Field Name'
                        description="Add a True/False Custom Field name in this box if posts should only be shown when it's true."
                        value={attributes.secondfieldName}
                        onChange={(newtext) => setAttributes({secondfieldName: newtext})} />
                </PanelRow>
            </PanelBody>

           
        </InspectorControls>
        );
    }

   
    getBlockControls = () => {
        const { attributes, setAttributes } = this.props;
        return (
            <BlockControls>
            <AlignmentToolbar
                value={attributes.textAlignment}
                onChange={(newalign) => setAttributes({ textAlignment: newalign })}
            />
            <Toolbar label="Preview">
                <ToolbarButton
                    label={this.state.editMode ? "Preview" : "edit" }
                    icon={ this.state.editMode ? "format-image" : "edit" }
                    className="my-custom-button"
                    onClick={() => this.setState({ editMode: !this.state.editMode })}
                />
            </Toolbar>
        </BlockControls>
        );
    }
 
    render() {
        const { attributes, setAttributes } = this.props;
        const alignmentClass = (attributes.textAlignment != null) ? 'has-text-align-' + attributes.textAlignment : '';
        let choices = [];
        if (this.props.typesList) {
            this.props.typesList.forEach(posttype => {
                choices.push({ value: posttype.slug, label: posttype.name });
            });
        } else {
            choices.push({ value: "0", label: 'Loading...' })
        }
 
        return ([
            this.getInspectorControls(),
            this.getBlockControls(),
            <div className={alignmentClass}>
                {this.state.editMode &&
                <Fragment>
                            <SelectControl
                                label='Choose Post Type'
                                options={choices}
                                value={attributes.selectedPostType}
                                onChange={(newval) => setAttributes({ selectedPostType: newval })}
                            />
                </Fragment>}

                {!this.state.editMode &&
                		<ServerSideRender
                            block={this.props.name}
                            attributes={{ 
                                selectedPostType: attributes.selectedPostType,
                                TaxonomyOrder: attributes.TaxonomyOrder,
                                orderTerms: attributes.orderTerms,
                                linkLocation: attributes.linkLocation,
                                fieldName: attributes.fieldName,
                                secondfieldName: attributes.secondfieldName,
                                excludedTaxonomies: attributes.excludedTaxonomies,
                                textAlignment: attributes.textAlignment

                            }}
                    />
                }
            </div>
        ]);
    }
}
 
registerBlockType('jch/posttypelist', {
    title: 'Post Type List',
    category: 'common',
    icon: 'editor-ul',
    description: 'List out your custom posts, organising by category, alphabetically or by Date Published.',
    keywords: ['List', 'Post Types'],
    attributes: {
        selectedPostType: {
            type: 'string',
            default: 'post'
        },
        orderTerms: {
            type: 'string',
            default: 'title'
        },
        TaxonomyOrder: {
            type: 'string'
        },
        linkLocation: {
            type: 'string',
            default: 'postpage'
        },
        fieldName: {
            type: 'string',
            default: ''
        },
        secondfieldName: {
            type: 'string',
            default: ''
        },
        excludedTaxonomies: {
            type: 'string',
            default: ''
        },
        textAlignment: {
            type: 'string',
            default: ''
        }
    },
    supports: {
        align: ['wide', 'full']
    },
    edit: withSelect(select => {
        const {getPostTypes} = select('core');
        return {
            typesList: getPostTypes(),
        }
    })(PostTypeListBlockEdit),
    save: () => { return null }
});