<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function jch_normal_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	/*wp_register_style(
		'card_block_new-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);*/

	// Register block editor script for backend.
	wp_register_script(
		'normal-jch-block-js', // Handle.
		plugins_url( '/build/blocks.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	/*wp_register_style(
		'card_block_new-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);*/

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'normal-jch-block-js',
		'jchGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
    
    add_theme_support( 'post-thumbnails' );
    add_image_size( 'rectangle', 400, 250, true );
	add_image_size( 'med_square', 400, 400, true );
	add_image_size( 'sml_square', 200, 200, true );
	add_image_size( 'lrg_rectangle', 800, 500, true );


	register_block_type(
		'jch/cardblock', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			// 'style'         => 'card_block_new-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'normal-jch-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			// 'editor_style'  => 'card_block_new-cgb-block-editor-css',
			'render_callback' => 'jch_cardblock_render',
			'attributes' => [
				'title' => [
					'type' => 'string',
					'source'=> 'text',
				],
				'body' => [
					'type' => 'string',
				],
				'imageAlt' => [
					'type' => 'string',
					'attribute' => 'alt'
				],
				'imageUrl' => [
					'attribute' => 'string'
				],
				'imgSize' => [
					'type' => 'string',
					'default' => 'rectangle'
				],
				'linkType' => [
					'type' => 'string'
				],
				'pageLink' => [
					'type' => 'number',
					'default' => 0
				],
				'fileLink' => [
					'type' => 'string'
				],
				'externalLink' => [
					'type' => 'string'

				],
				'showbutton' => [
					'type' => 'boolean',
					'default' => false
				],
				'buttonText' => [
					'type' => 'string',
					'default' => 'Read More'
				],
				'textAlignment' => [
					'type' => 'string'
				]
			]
		)
	);
	register_block_type(
		'jch/pageselector', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			// 'style'         => 'card_block_new-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'normal-jch-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			// 'editor_style'  => 'card_block_new-cgb-block-editor-css',
			'render_callback' => 'jch_pageselector_render',
			'attributes' => [
				'selectedPostId' => [
					'type' => 'number',
					'default' => 0
				],
				'textAlignment' => [
					'type' => 'string'
				],
				'showbutton' => [
					'type' => 'boolean',
					'default' => true
				],
				'buttonText' => [
					'type' => 'string',
					'default' => 'Read More'
				]
			]
		)
	);

	register_block_type(
		'jch/acfselector', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			// 'style'         => 'card_block_new-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'normal-jch-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			// 'editor_style'  => 'card_block_new-cgb-block-editor-css',
			'render_callback' => 'jch_acfselector_render',
			'attributes' => [
				'selectedField' => [
					'type' => 'string'
				],
				'showIcon' => [
					'type' => 'boolean',
					'default' => true
				],
				'additionalText' => [
					'type' => 'string',
					'default' => ''
				]
			]
		)
	);

	register_block_type(
		'jch/posttypelist', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			// 'style'         => 'card_block_new-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'normal-jch-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			// 'editor_style'  => 'card_block_new-cgb-block-editor-css',
			'render_callback' => 'jch_posttypelist_render',
			'attributes' => [
				'selectedPostType' => [
					'type' => 'string'
				],
				'orderTerms' => [
					'type' => 'string',
					'default' => 'title'
				],
				'TaxonomyOrder' => [
					'type' => 'string'
				],
				'linkLocation' => [
					'type' => 'string',
					'default' => 'postpage'
				],
				'fieldName' => [
					'type' => 'string',
					'default' => ''
				],
				'secondfieldName' => [
					'type' => 'string',
					'default' => ''
				],
				'excludedTaxonomies' => [
					'type' => 'string',
					'default' => ''
				],
				'textAlignment' => [
					'type' => 'string',
					'default' => ''
				]
			]
		)
	);

	register_block_type(
		'jch/featuredreview', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			// 'style'         => 'card_block_new-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'normal-jch-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			// 'editor_style'  => 'card_block_new-cgb-block-editor-css',
			'render_callback' => 'jch_featuredreview_render',
			'attributes' => [
				'selectedPostId' => [
					'type' => 'number'
				],
				'featuredOrLatest' => [
					'type' => 'string',
					'default' => 'latest'
				],
				'showArchiveButton' => [
					'type' => 'boolean',
					'default' => true
				],
				'buttonText' => [
					'type' => 'string',
					'default' => 'View More Reviews'
				]
			]
		)
	);
}

// Hook: Block assets.
add_action( 'init', 'jch_normal_block_assets' );


//Featured Review Callback


function jch_featuredreview_render($attr, $content) {
	$str = '';
	$archivelink = get_post_type_archive_link( 'reviews' );
	$reviewtype = $attr['featuredOrLatest'];
	if ($reviewtype == 'latest') {
		$loop = new WP_Query(
			array(
				'post_type' => 'reviews',
				'posts_per_page' => 1
			)
		);
		while ( $loop->have_posts() ) : $loop->the_post();
			$str = '<div class="jch-featuredreview">';
			$str .= '<div class="review_innercontainer">';
			$str .=  '<blockquote>'.get_the_content(). '</blockquote>';
			$str .= '<h4>' . get_the_title() . '</h4>';
			if ($attr['showArchiveButton'] == true) {
				$str .= '<a class="review_btn" href="'.$archivelink .'">' .$attr['buttonText']. '</a>';
			}
			$str .= '</div>';
			$str .= '</div>';
		endwhile;
		wp_reset_postdata();
		
	} else {
		if ($attr['selectedPostId'] > 0) {
			$post = get_post($attr['selectedPostId']);
			if (!$post) {
				return $str;
			}	
			$content = get_the_content($post);
			$str = '<div class="jch-featuredreview">';
			$str .= '<div class="review_innercontainer">';
			$str .=  '<blockquote>'.$post->post_content. '</blockquote>';
			$str .= '<h4>' . get_the_title($post) . '</h4>';
			if ($attr['showArchiveButton'] == true) {
				$str .= '<a class="review_btn" href="'.$archivelink .'">' .$attr['buttonText']. '</a>';
			}
			$str .= '</div>';
			$str .= '</div>';
		}
	}
	return $str;
}


//helper function - get image id from URl

function get_attachment_id( $url ) {

	$attachment_id = 0;

	$dir = wp_upload_dir();

	if ( false !== strpos( $url, $dir['baseurl'] . '/' ) ) { // Is URL in uploads directory?
		$file = basename( $url );

		$query_args = array(
			'post_type'   => 'attachment',
			'post_status' => 'inherit',
			'fields'      => 'ids',
			'meta_query'  => array(
				array(
					'value'   => $file,
					'compare' => 'LIKE',
					'key'     => '_wp_attachment_metadata',
				),
			)
		);

		$query = new WP_Query( $query_args );

		if ( $query->have_posts() ) {

			foreach ( $query->posts as $post_id ) {

				$meta = wp_get_attachment_metadata( $post_id );

				$original_file       = basename( $meta['file'] );
				$cropped_image_files = wp_list_pluck( $meta['sizes'], 'file' );

				if ( $original_file === $file || in_array( $file, $cropped_image_files ) ) {
					$attachment_id = $post_id;
					break;
				}

			}

		}

	}

	return $attachment_id;
}




//Render Callback for Card Block

function jch_cardblock_render($attr, $content) {

	$image_size = $attr['imgSize'];
	$image_id = get_attachment_id( $attr['imageUrl'] );
	$str = '';
	$str .= '<div class="jch-cardblock" >';
	if ($attr['linkType'] == "ext_link") {
		$str .= '<a target="_blank" href="'.esc_url($attr['externalLink']).'">';
	} elseif($attr['linkType'] == "file_download") {
		$str .= '<a target="_blank" href="'.esc_url($attr['fileLink']).'">';
	} elseif($attr['linkType'] == "page_link") {
		$str .= '<a href="'.get_the_permalink($attr['pageLink']).'">';
	} else {}
	$alignmentClass = ($attr['textAlignment'] != null) ? 'has-text-align-' . $attr['textAlignment'] : '';
	$str .= '<div class = "' .$alignmentClass. '&nbsp;jch_card">';
	$str .= '<div class="image_container imgfix">';
	$str .= wp_get_attachment_image( $image_id, $image_size).'</div>';
	$str .= '<div class = "card__content"><h3>'.$attr["title"].'</h3>';
	if ($attr['body']) {
	$str .= '<p>' .$attr['body']. '</p>';
	}
	if ($attr['showbutton']) {
		$str .= '<Button class="btn card_button">' .$attr['buttonText'] .'</Button>';
	}
	$str .= '</div></div>';
	if (($attr['linkType'] == "ext_link") || ($attr['linkType'] == "file_download") || ($attr['linkType'] == "page_link")) {
		$str .= '</a>';
	}
	$str .= '</div>';
	return $str;

}

//Render Callback for Post Type List

function jch_posttypelist_render($attr, $content) {
	$fullstr = '';
	$alignmentClass = ($attr['textAlignment'] != null) ? 'has-text-align-' . $attr['textAlignment'] : '';
	if ($attr['selectedPostType'] != "0") {
		$subarr = array();
		$arr = array();
		$orderby = ($attr['orderTerms'] == 'taxterms') ? "title" : $attr['orderTerms'];
		$order = ($attr['orderTerms'] == 'date') ? "DESC" : "ASC";
		$excl_terms = ($attr['excludedTaxonomies'] == "") ? "" : explode(",", $attr['excludedTaxonomies']); 
		$terms = get_terms($attr['TaxonomyOrder'], array('order' => 'ASC', 'hide_empty' => 1, 'parent' => 0, 'exclude' => $excl_terms));
		if ($attr['linkLocation'] == "file" && $attr['secondfieldName'] !== "") {
			$meta_query = array(
			array(
				'key' => $attr['fieldName'],
				'value'   => array(''),
				'compare' => 'NOT IN'
			),
			array(
				'key' => $attr['secondfieldName'],
				'value'   => '1'
			)
			);
		} elseif($attr['secondfieldName'] !== "") {
			$meta_query = array(
				array(
					'key' => $attr['secondfieldName'],
					'value'   => '1'

				)
				);
		} else {
			$meta_query ="";
		}
		if ($attr['orderTerms'] == 'taxterms') {
			$sub_subarr = array();
			foreach($terms as $term) {
				$title = '<h3>' .$term->name.'</h3>';
				$term_children = get_term_children($term->term_id, $attr['TaxonomyOrder']);
				if ($term_children) {
					foreach($term_children as $term_child) {
						$childTerm = get_term_by( 'id', $term_child, $attr['TaxonomyOrder'] );
						$subtitle = '<h4>' .$childTerm->name.'</h4>';
						$loop = new WP_Query(
							array(
								'post_type' => $attr['selectedPostType'], // This is the name of your post type - change this as required,
								'posts_per_page' => -1, // This is the amount of posts per page you want to show
								'orderby' => $order,
								'order' => $order,
								'meta_query' => $meta_query,
								'tax_query' => array(
									array(
										'taxonomy' => $attr['TaxonomyOrder'],
										'field' => 'id',
										'terms' => $term_child

									)
								),
							)
						);
						while ( $loop->have_posts() ) : $loop->the_post();
						// The content you want to loop goes in here:
							$post_cont = ($attr['linkLocation'] == "file") ? '<li><a target="_blank" href="' . get_field($attr['fieldName']) . '">' : '<li><a href="' . get_the_permalink() . '">';
							$post_cont .= get_the_title();
							$post_cont .= '</a></li>';
							array_push($sub_subarr, $post_cont);
						endwhile;

						
						$sub_substr = ($sub_subarr != array()) ? "<div class='jch-posttypelist-alpha ".$alignmentClass. "'>" . $subtitle . "<ul>" .implode('', $sub_subarr) . "</ul></div>": "";
						array_push($subarr, $sub_substr);
						$sub_subarr = array();
						wp_reset_postdata();
					}
				} else {
					$alphas = range('a', 'z');
					foreach($alphas as $alpha) {
						$loop = new WP_Query(
							array(
								'post_type' => $attr['selectedPostType'], // This is the name of your post type - change this as required,
								'posts_per_page' => -1, // This is the amount of posts per page you want to show
								'orderby' => $order,
								'order' => $order,
								'meta_query' => $meta_query,
								'tax_query' => array(
									array(
										'taxonomy' => $attr['TaxonomyOrder'],
										'field' => 'id',
										'terms' => $term->term_id
									)
								),
							)
						);
						while ( $loop->have_posts() ) : $loop->the_post();
						// The content you want to loop goes in here:
						global $post;
						$post_slug = $post->post_name;
						$post_title = strtolower(get_the_title());
							if ($post_slug[0] == $alpha) {
								$post_cont = ($attr['linkLocation'] == "file") ? '<li><a target="_blank" href="' . get_field($attr['fieldName']) . '">' : '<li><a href="' . get_the_permalink() . '">';
								$post_cont .= get_the_title();
								$post_cont .= '</a></li>';
								array_push($sub_subarr, $post_cont);
							}

						endwhile;

						
						$alphaTitle = '<h4>' .$alpha.'</h4>';
						$sub_substr = ($sub_subarr != array()) ? "<div class='jch-posttypelist-alpha ".$alignmentClass. "'>" . $alphaTitle . "<ul>" .implode('', $sub_subarr) . "</ul></div>": '';
						array_push($subarr, $sub_substr);
						$sub_subarr = array();
						wp_reset_postdata();
					}
				}

				$substr = ($subarr != array()) ? "<div class='jch-posttypelist ".$alignmentClass. "'>" . $title . "<ul>" .implode('', $subarr) . "</ul></div>": '';
				array_push($arr, $substr);
				$subarr = array();
				wp_reset_postdata();
			}

		} elseif($attr['orderTerms'] == 'title') {
			$alphas = range('a', 'z');
			foreach($alphas as $alpha) {

				$loop = new WP_Query(
					array(
						'post_type' => $attr['selectedPostType'], // This is the name of your post type - change this as required,
						'posts_per_page' => -1, // This is the amount of posts per page you want to show
						'orderby' => $order,
						'order' => $order,
						'meta_query' => $meta_query,
					)
				);
				while ( $loop->have_posts() ) : $loop->the_post();
					$post_title = strtolower(get_the_title());
					global $post;
					$post_slug = $post->post_name;
					if ($post_slug[0] == $alpha) {
						$post_cont = ($attr['linkLocation'] == "file") ? '<li><a target="_blank" href="' . get_field($attr['fieldName']) . '">' : '<li><a href="' . get_the_permalink() . '">';
						$post_cont .= get_the_title();
						$post_cont .= '</a></li>';
						array_push($subarr, $post_cont);
					}
				// The content you want to loop goes in here:
				endwhile;
				$title = '<h3>' .$alpha.'</h3>';
				$substr = ($subarr != array()) ? "<div class='jch-posttypelist ".$alignmentClass. "'>" . $title . "<ul>" .implode('', $subarr) . "</ul></div>": '';
				array_push($arr, $substr);
				$subarr = array();
				wp_reset_postdata();
			}
			
			
		} else {

				$loop = new WP_Query(
					array(
						'post_type' => $attr['selectedPostType'], // This is the name of your post type - change this as required,
						'posts_per_page' => -1, // This is the amount of posts per page you want to show
						'orderby' => $order,
						'order' => $order,
						'meta_query' => $meta_query
					)
				);
				while ( $loop->have_posts() ) : $loop->the_post();
				// The content you want to loop goes in here:
				    $post_cont = ($attr['linkLocation'] == "file") ? '<li><a target="_blank" href="' . get_field($attr['fieldName']) . '">' : '<li><a href="' . get_the_permalink() . '">';
					$post_cont .= get_the_title();
					$post_cont .= '</a></li>';
					array_push($subarr, $post_cont);
				endwhile;
				$substr = "<div class='jch-posttypelist ".$alignmentClass. "'><ul>" .implode('', $subarr) . "</ul></div>";
				array_push($arr, $substr);
				$subarr = array();
				wp_reset_postdata();
		}
	
	}
	$fullstr = "<div class='jch-posttypelist-block'>" .implode('',$arr). "</div>";
	return $fullstr;
}

//Render Callback for Page Selector Block


function jch_pageselector_render($attr, $content) {
	$str = '';
	$alignmentClass = ($attr['textAlignment'] != null) ? 'has-text-align-' . $attr['textAlignment'] : '';

	if ($attr['selectedPostId'] > 0) {
		$post = get_post($attr['selectedPostId']);
		if (!$post) {
			return $str;
		}
		$str = '<div class="jch-pageselector '.$alignmentClass. '">';
		$str .= '<a href="' . get_the_permalink($post) . '">';
        $str .=  '<div class="img_container">'. get_the_post_thumbnail( $post, 'rectangle') . '</div>';
		$str .= '<h3>' . get_the_title($post) . '</h3>';
		if ($attr['showbutton'] == true) {
			$str .= '<button>' .$attr['buttonText']. '</button>';
		}
		$str .= '</a>';
		$str .= '</div>';
	}
	return $str;
}

//helper function - find the ID of a page from it's page name
function get_ID_by_page_name($page_name) {
	global $wpdb;
	$page_name_id = $wpdb->get_var("SELECT ID FROM $wpdb->posts WHERE post_name = '".$page_name."' AND post_type = 'page'");
	return $page_name_id;
 }

//Render Callback for ACF Selector

function jch_acfselector_render($attr, $content) {
	$field_location = get_ID_by_page_name('theme-settings');
	$str = '';
	$field = $attr['selectedField'] != null ? $attr['selectedField'] : 'email_address';
	if ($field != null) {
		//start of field group
		$comp_info = get_field('company_information', $field_location);
		if( $comp_info ):
			//Finding the type of field
			$field_object = get_field_object('company_information', $field_location);
			$sub_field_object = $field_object['sub_fields'];
			$sub_type = "";
			foreach ($sub_field_object as $sub_field) {
				if ($sub_field['name'] == $field)  {
					$sub_type = $sub_field['type']; 
				}
			  } 
			  /*******/
			if ($sub_type == "text" ) {
				$field_output = esc_html( $comp_info[$field] );
				$str = '';
				$str .= '<div class="jch_acf_block">';
				if ($field == 'phone_number') {
					if ($attr['showIcon'] == true){
						$str .= '<i class="fas fa-phone"></i> ';
					}
				} elseif ($field == 'mobile_phone') {
					if ($attr['showIcon'] == true){
						$str .= '<i class="fas fa-mobile-alt"></i> ';
					}
				} else {}
				if ($attr['additionalText'] != null){
					$str .= $attr['additionalText'];
				}
				$str .= $field_output . '</div>';
			} elseif ($sub_type == "textarea"){
				$field_output = esc_textarea( $comp_info[$field] );
				$str = '';
				$str .= '<div class="jch_acf_block">';
				if ($attr['showIcon'] == true){
					$str .= '<i class="fas fa-map-marker-alt"></i> ';
				}
				if ($attr['additionalText'] != null){
					$str .= $attr['additionalText'];
				}	
				$str .= $field_output . '</div>';
			} elseif ($sub_type == "email"){
				$field_output = esc_html( $comp_info[$field] );
				$str = '';
				$str .= '<div class="jch_acf_block">';
				$str .= '<a href="mailto:'.$field_output.'">';
				if ($attr['showIcon'] == true){
					$str .= '<i class="fas fa-envelope"></i> ';
				}
				if ($attr['additionalText'] != null){
					$str .= $attr['additionalText'];
				}	
				$str .= $field_output. '</a></div>';
			} elseif ($sub_type == "url"){
				$field_output = esc_url( $comp_info[$field] );
				$str = '';
				$str .= '<div class="jch_acf_block">';
				$str .= '<a target="_blank" href="'.$field_output.'">';
				if ($field == 'facebook') {
					if ($attr['showIcon'] == true){
						$str .= '<i class="fab fa-facebook-f"></i> ';
					}
					if ($attr['additionalText'] != null){
						$str .= $attr['additionalText'];
					}	
				} elseif ($field == 'instagram') {
					if ($attr['showIcon'] == true){
						$str .= '<i class="fab fa-instagram"></i> ';
					}
					if ($attr['additionalText'] != null){
						$str .= $attr['additionalText'];
					}
					
				} else {
					$str .= $field_output;
				}
				$str .= '</a></div>';
			} else {
				$str = "";
			}
		endif;
		//end of field group
	}
	return $str;
}

//END - Render Callback for ACF Selector

