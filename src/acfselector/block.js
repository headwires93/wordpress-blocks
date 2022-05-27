const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { ServerSideRender } = wp.editor;
const { TextControl, ToggleControl, PanelBody, PanelRow, CheckboxControl, SelectControl, Toolbar, ToolbarButton, Placeholder, Disabled } = wp.components;
const { withSelect, select } = wp.data;
 
class acfSelectorBlockEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode:true
        }
    }

    getInspectorControls = () => {
        const { attributes, setAttributes } = this.props;
        return (
        <InspectorControls>
        <PanelBody
            title="Content Controls"
            initialOpen={true}
        >
            <PanelRow>
                <ToggleControl
                    label="Show Icon?"
                    checked={attributes.showIcon}
                    onChange={(newval) => setAttributes({ showIcon: newval })}
                />
            </PanelRow>
                <PanelRow>
                    <TextControl 
                        label="Additional Text"
                        value={attributes.additionalText}
                        onChange={(newtext) => setAttributes({additionalText: newtext})} />
                </PanelRow>
            
            </PanelBody>
        </InspectorControls>
        );
    }

   
   
    getBlockControls = () => {
        const { attributes, setAttributes } = this.props;
        return (
            <BlockControls>
            <Toolbar label = "Preview">
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
    
        let choices = [
            {value: 'email_address', label: 'Email Address'},
            {value: 'phone_number', label: 'Phone Number'},
            {value: 'mobile_phone', label: 'Mobile Number'},
            {value: 'facebook', label: 'Facebook Link'},
            {value: 'instagram', label: 'Instagram Link'},
            {value: 'address', label: 'Address'}            
        ];

 
        return ([
            this.getBlockControls(),
            this.getInspectorControls(),
            <div>
                {this.state.editMode &&
                <Fragment>
                            <SelectControl
                                label='Field'
                                options={choices}
                                value={attributes.selectedField}
                                onChange={(newval) => setAttributes({ selectedField: newval })}
                            />
                </Fragment>}

                {!this.state.editMode &&
                		<ServerSideRender
                            block={this.props.name}
                            attributes={{ 
                                selectedField: attributes.selectedField,
                                showIcon: attributes.showIcon,
                                additionalText: attributes.additionalText,
                            }}
                    />
                }
            </div>
        ]);
    }
}
 
registerBlockType('jch/acfselector', {
    title: 'Company Info Selector',
    category: 'common',
    icon: 'editor-alignleft',
    description: 'Display Company Infosuch as your company email address or phone number.',
    keywords: ['acf'],
    attributes: {
        selectedField: {
            type: 'string'
        },
        showIcon: {
            type: 'boolean',
            default: true
        },
        additionalText: {
            type: 'string',
            default: ''
        },
    },
    edit: acfSelectorBlockEdit,
    save: () => { return null }
});