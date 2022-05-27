const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { ServerSideRender } = wp.editor;
const { TextControl, ToggleControl, PanelBody, PanelRow, CheckboxControl, SelectControl, Toolbar, ToolbarButton, Placeholder, Disabled } = wp.components;
const { withSelect, select } = wp.data;
 
class PageSelectorBlockEdit extends Component {
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
            title="Button Controls"
            initialOpen={true}
        >
            <PanelRow>
                <ToggleControl
                    label="Show Button?"
                    checked={attributes.showbutton}
                    onChange={(newval) => setAttributes({ showbutton: newval })}
                />
            </PanelRow>
            {attributes.showbutton && 
                <PanelRow>
                    <TextControl 
                        value={attributes.buttonText}
                        onChange={(newtext) => setAttributes({buttonText: newtext})} />
                </PanelRow>
                }
            
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
        if (this.props.posts) {
            choices.push({ value: 0, label: 'Select a page' });
            this.props.posts.forEach(post => {
                choices.push({ value: post.id, label: post.title.rendered });
            });
        } else {
            choices.push({ value: 0, label: 'Loading...' })
        }
 
        return ([
            this.getInspectorControls(),
            this.getBlockControls(),
            <div className={alignmentClass}>
                {this.state.editMode &&
                <Fragment>
                            <SelectControl
                                label='Selected Page'
                                options={choices}
                                value={attributes.selectedPostId}
                                onChange={(newval) => setAttributes({ selectedPostId: parseInt(newval) })}
                            />
                </Fragment>}

                {!this.state.editMode &&
                		<ServerSideRender
                            block={this.props.name}
                            attributes={{ 
                                selectedPostId: attributes.selectedPostId,
                                showbutton: attributes.showbutton,
                                buttonText: attributes.buttonText,
                            }}
                    />
                }
            </div>
        ]);
    }
}
 
registerBlockType('jch/pageselector', {
    title: 'Page Selector',
    category: 'common',
    icon: 'cover-image',
    description: 'Choose a page to display as a card that links through to that page.',
    keywords: ['Card', 'Page Link'],
    attributes: {
        selectedPostId: {
            type: 'number'
        },
        textAlignment: {
            type: 'string',
        },
        showbutton: {
            type: 'boolean',
            default: true
        },
        buttonText: {
            type: 'string',
            default: 'Read More'
        },
    },
    edit: withSelect(select => {
        const currentPostId = select('core/editor').getCurrentPostId();
        const query = {
            per_page: -1,
            exclude: currentPostId
        }
        return {
            posts: select('core').getEntityRecords('postType', 'page', query)
        }
    })(PageSelectorBlockEdit),
    save: () => { return null }
});