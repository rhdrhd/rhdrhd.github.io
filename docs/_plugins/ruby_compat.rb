# frozen_string_literal: true

# Provide Ruby 3+ compatibility for older versions of Liquid/Jekyll that still
# rely on the taint/trust APIs which were removed from Ruby core. GitHub Pages
# still runs on an older Ruby, so we only patch the methods when they are
# missing locally.
unless ''.respond_to?(:tainted?)
  class Object
    def tainted?
      false
    end

    def taint
      self
    end

    def untaint
      self
    end
  end
end
